#!/usr/bin/env tsx
/**
 * Database Seed Script
 *
 * Migrates all 109 tasks from the legacy static client data into PostgreSQL.
 *
 * Usage:
 *   npm run seed
 *   or
 *   tsx src/scripts/seed.ts
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users, projects, tasks, projectMembers } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Import legacy data from client
// Note: We're copying the data structure here to avoid direct imports from client
// In production, you might want to share these via a common package

interface LegacyTask {
  id: string;
  name: string;
  nameEn: string;
  assignee: string;
  hours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  dependencies: string[];
  phase: number;
  section: string;
  sectionEn: string;
  manualStatus?: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
}

interface LegacyTeamMember {
  name: string;
  role: string;
  roleEn: string;
  avatar: string;
}

// Hardcoded legacy data (copied from client for seed purposes)
const legacyTeamMembers: LegacyTeamMember[] = [
  { name: 'Aldo', role: 'CEO MADFAM', roleEn: 'CEO MADFAM', avatar: '👨‍💼' },
  { name: 'Nuri', role: 'Oficial de Estrategia MADFAM', roleEn: 'Strategy Officer MADFAM', avatar: '👩‍💼' },
  { name: 'Luis', role: 'Rep. La Ciencia del Juego', roleEn: 'La Ciencia del Juego Rep.', avatar: '👨‍🔬' },
  { name: 'Silvia', role: 'Gurú de Marketing', roleEn: 'Marketing Guru', avatar: '👩‍🎨' },
  { name: 'Caro', role: 'Diseñadora y Maestra', roleEn: 'Designer and Teacher', avatar: '👩‍🎓' },
];

// Import all legacy tasks (we'll load these from the actual client files at runtime)
// For now, we'll import them dynamically
const loadLegacyTasks = async (): Promise<LegacyTask[]> => {
  // Dynamically import from the client package
  const phase1Module = await import('../../../client/src/data/tasks/phase1.js');
  const phase2Module = await import('../../../client/src/data/tasks/phase2.js');
  const phase3Module = await import('../../../client/src/data/tasks/phase3.js');
  const phase4Module = await import('../../../client/src/data/tasks/phase4.js');
  const phase5Module = await import('../../../client/src/data/tasks/phase5.js');

  return [
    ...phase1Module.phase1Tasks,
    ...phase2Module.phase2Tasks,
    ...phase3Module.phase3Tasks,
    ...phase4Module.phase4Tasks,
    ...phase5Module.phase5Tasks,
  ];
};

// Difficulty mapping helper
const mapDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5): 'easy' | 'medium' | 'hard' | 'expert' => {
  if (difficulty <= 2) return 'easy';
  if (difficulty === 3) return 'medium';
  if (difficulty === 4) return 'hard';
  return 'expert';
};

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // Create database connection
  const connectionString = process.env.DATABASE_URL || 'postgresql://madlab:madlab@localhost:5432/madlab';
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool);

  try {
    // ========================================================================
    // Step 1: Upsert Team Members (Users)
    // ========================================================================
    console.log('👥 Step 1: Upserting team members...');
    const userMap = new Map<string, string>(); // name -> UUID

    for (const member of legacyTeamMembers) {
      // Check if user exists
      const existing = await db.select().from(users).where(eq(users.email, `${member.name.toLowerCase()}@madlab.mx`)).limit(1);

      let userId: string;
      if (existing.length > 0) {
        userId = existing[0].id;
        console.log(`  ✓ User already exists: ${member.name} (${userId})`);
      } else {
        // Create user
        const [newUser] = await db.insert(users).values({
          januaId: `mock-janua-${member.name.toLowerCase()}`,
          email: `${member.name.toLowerCase()}@madlab.mx`,
          name: member.name,
          displayName: member.name,
          avatarUrl: member.avatar,
          metadata: {
            role: member.role,
            roleEn: member.roleEn,
            isTeamMember: true,
          },
        }).returning();

        userId = newUser.id;
        console.log(`  ✓ Created user: ${member.name} (${userId})`);
      }

      userMap.set(member.name, userId);

      // Handle special case for "All" assignee
      if (member.name === 'Aldo') {
        userMap.set('All', userId); // Default "All" tasks to Aldo for now
      }
    }

    console.log(`  ✅ Processed ${userMap.size - 1} team members\n`);

    // ========================================================================
    // Step 2: Create Main Project
    // ========================================================================
    console.log('📁 Step 2: Creating main project...');

    // Check if project exists
    const existingProject = await db.select().from(projects).where(eq(projects.name, 'MADLAB Educational Platform')).limit(1);

    let projectId: string;
    if (existingProject.length > 0) {
      projectId = existingProject[0].id;
      console.log(`  ✓ Project already exists: ${projectId}\n`);
    } else {
      const [newProject] = await db.insert(projects).values({
        name: 'MADLAB Educational Platform',
        nameEn: 'MADLAB Educational Platform',
        description: 'Gamified science and technology learning program for primary schools in Mexico, focused on SDGs (clean water, clean energy, recycling)',
        descriptionEn: 'Gamified science and technology learning program for primary schools in Mexico, focused on SDGs (clean water, clean energy, recycling)',
        status: 'active',
        startDate: new Date('2025-08-11'),
        targetEndDate: new Date('2025-10-31'),
        metadata: {
          duration: 81,
          targetAudience: '20-100 students per 3-hour presentation',
          sdgFocus: ['Clean Water', 'Clean Energy', 'Recycling'],
          teamSize: 5,
          phases: 5,
        },
      }).returning();

      projectId = newProject.id;
      console.log(`  ✅ Created project: ${projectId}\n`);
    }

    // ========================================================================
    // Step 3: Add Team Members to Project
    // ========================================================================
    console.log('👥 Step 3: Adding team members to project...');

    let addedMembers = 0;
    for (const [name, userId] of userMap.entries()) {
      if (name === 'All') continue; // Skip the "All" alias

      // Check if already member
      const existingMembership = await db.select().from(projectMembers)
        .where(eq(projectMembers.projectId, projectId))
        .where(eq(projectMembers.userId, userId))
        .limit(1);

      if (existingMembership.length === 0) {
        await db.insert(projectMembers).values({
          projectId,
          userId,
          role: name === 'Aldo' ? 'owner' : 'member',
        });
        addedMembers++;
      }
    }

    console.log(`  ✅ Added ${addedMembers} members to project\n`);

    // ========================================================================
    // Step 4: Load and Insert Tasks
    // ========================================================================
    console.log('📝 Step 4: Loading legacy tasks...');
    const legacyTasks = await loadLegacyTasks();
    console.log(`  ✓ Loaded ${legacyTasks.length} tasks from client data\n`);

    console.log('📝 Step 5: Inserting tasks into database...');
    let insertedCount = 0;
    let skippedCount = 0;

    for (const legacyTask of legacyTasks) {
      // Check if task already exists
      const existingTask = await db.select().from(tasks)
        .where(eq(tasks.legacyId, legacyTask.id))
        .limit(1);

      if (existingTask.length > 0) {
        skippedCount++;
        continue;
      }

      // Map assignee name to user ID
      const assigneeId = userMap.get(legacyTask.assignee);
      if (!assigneeId) {
        console.warn(`  ⚠️  Warning: Unknown assignee "${legacyTask.assignee}" for task ${legacyTask.id}`);
      }

      // Build metadata object with unmapped fields
      const metadata: Record<string, any> = {
        section: legacyTask.section,
        sectionEn: legacyTask.sectionEn,
      };

      if (legacyTask.manualStatus) {
        metadata.manualStatus = legacyTask.manualStatus;
      }

      if (legacyTask.statusHistory) {
        metadata.statusHistory = legacyTask.statusHistory;
      }

      // Insert task
      await db.insert(tasks).values({
        projectId,
        legacyId: legacyTask.id,
        title: legacyTask.name,
        titleEn: legacyTask.nameEn,
        description: `${legacyTask.section} - ${legacyTask.name}`,
        descriptionEn: `${legacyTask.sectionEn} - ${legacyTask.nameEn}`,
        status: legacyTask.manualStatus || 'not-started',
        assigneeId: assigneeId || null,
        estimatedHours: legacyTask.hours,
        difficulty: mapDifficulty(legacyTask.difficulty),
        phase: legacyTask.phase,
        dependencies: legacyTask.dependencies,
        metadata,
      });

      insertedCount++;

      // Progress indicator
      if (insertedCount % 10 === 0) {
        console.log(`  ✓ Inserted ${insertedCount}/${legacyTasks.length} tasks...`);
      }
    }

    console.log(`  ✅ Inserted ${insertedCount} tasks (skipped ${skippedCount} duplicates)\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('🎉 Seed completed successfully!\n');
    console.log('Summary:');
    console.log(`  - Team Members: ${userMap.size - 1}`);
    console.log('  - Projects: 1');
    console.log(`  - Tasks: ${insertedCount}`);
    console.log(`  - Total Duration: ${legacyTasks.reduce((sum, t) => sum + t.hours, 0)} hours\n`);

    // Verify task count
    const finalTaskCount = await db.select().from(tasks);
    console.log(`✅ Database verification: ${finalTaskCount.length} tasks in database\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    // Close connection
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

// Run seed
seed()
  .then(() => {
    console.log('✅ Seed script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });
