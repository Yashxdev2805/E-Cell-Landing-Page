export interface TelemetryData {
  startupsRegistered: number;
  totalApplicants: number;
  workshopsHosted: number;
  activeCommunity: number;
  lastUpdated: string;
}

export interface MaskedTrackingData {
  refId: string;
  sourceType: 'PITCH_ARENA' | 'COUNCIL_RECRUITMENT';
  titleOrTeam: string;
  categoryOrDomain: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  submittedAt: string;
  timeline: {
    step: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export interface JoinApplicationPayload {
  fullName: string;
  rollNo: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  domain: string;
  sop: string;
  experience?: string;
  links: { platform: string; url: string }[];
  turnstileToken?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  type?: 'student' | 'sponsor' | 'startup' | 'speaker' | 'other';
  organization?: string;
  turnstileToken?: string;
}

const API_BASE = '/api/portal';

export async function fetchPortalStats(): Promise<TelemetryData> {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`Stats error: ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('⚠️ [API] Stats fetch fallback:', err);
    return {
      startupsRegistered: 150,
      totalApplicants: 540,
      workshopsHosted: 28,
      activeCommunity: 1200,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function trackApplication(refId: string): Promise<MaskedTrackingData> {
  const clean = refId.trim().toUpperCase();
  const res = await fetch(`${API_BASE}/track/${encodeURIComponent(clean)}`);
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'No matching application or pitch team found.');
  }
  const json = await res.json();
  return json.data;
}

export async function submitJoinApplication(data: JoinApplicationPayload): Promise<{ refId: string; message: string }> {
  const idempotencyKey = `join_${data.rollNo}_${Date.now()}`;
  const res = await fetch(`${API_BASE}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || json.detail || 'Failed to submit application.');
  }

  return {
    refId: json.refId,
    message: json.message || 'Application submitted successfully!',
  };
}

export async function submitContactMessage(data: ContactMessagePayload): Promise<{ inquiryId: string; message: string }> {
  const idempotencyKey = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || 'Failed to send inquiry.');
  }

  return {
    inquiryId: json.inquiryId,
    message: json.message || 'Message sent successfully!',
  };
}
