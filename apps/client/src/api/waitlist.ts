/**
 * Waitlist API Client
 * Handles waitlist signup for the MADLAB landing page
 */

import apiClient from './client';

// ============================================================================
// Types
// ============================================================================

export interface WaitlistSignupRequest {
    email: string;
    source?: string;
    referrer?: string;
    name?: string;
    ndProfile?: 'adhd' | 'autism' | 'dyslexia' | 'other';
    useCase?: string;
}

export interface WaitlistSignupResponse {
    success: boolean;
    message: string;
    id?: string;
    alreadySignedUp?: boolean;
}

export interface WaitlistCountResponse {
    success: boolean;
    count: number;
    display: string;
}

// ============================================================================
// API Methods
// ============================================================================

export const waitlistApi = {
    /**
     * Sign up for the waitlist
     */
    async signup(request: WaitlistSignupRequest): Promise<WaitlistSignupResponse> {
        const { data } = await apiClient.post<WaitlistSignupResponse>('/waitlist', {
            ...request,
            source: request.source || 'landing',
            referrer: document.referrer || undefined,
        });
        return data;
    },

    /**
     * Get waitlist count for social proof
     */
    async getCount(): Promise<WaitlistCountResponse> {
        const { data } = await apiClient.get<WaitlistCountResponse>('/waitlist/count');
        return data;
    },
};

export default waitlistApi;
