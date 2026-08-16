// RequestWaterPage.jsx (JavaScript)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestService } from '../../services/requestService';
import { LocationPicker } from '../../components/maps/LocationPicker';
import { PriorityScoreCard } from '../../components/common/PriorityScoreCard';
import {
  MapPin,
  Droplet,
  Users,
  Calendar,
  Building2,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const RequestWaterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Location, 2: Requirement, 3: Vulnerability, 4: Review, 5: Success
  const [loading, setLoading] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    citizenId: user?.id || 'usr-cit-101',
    citizenName: user?.name || 'Ramesh Jadhav',
    citizenPhone: user?.phone || '+91 98765 43210',
    address: 'Plot 42, Mayur Colony, Kothrud, Pune - 411038',
    latitude: 18.5074,
    longitude: 73.8077,
    quantityLiters: 6000,
    peopleAffected: 45,
    daysWithoutWater: 4,
    facilityType: 'HOUSEHOLD',
    hasInfantsOrElderly: true,
    notes: 'Ground sump completely dry. Several senior citizens and infants in apartment building.',
  });

  const handleLocationSelect = (loc) => {
    setFormData((prev) => ({
      ...prev,
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
    }));
  };

  // Preview AI Score Calculation
  const calculatePreviewScore = () => {
    let vulnerabilityWeight = formData.hasInfantsOrElderly ? 8.5 : 5.0;
    if (formData.facilityType === 'HOSPITAL_CLINIC') vulnerabilityWeight = 10.0;
    if (formData.facilityType === 'SLUM_COMMUNITY') vulnerabilityWeight = 9.5;
    if (formData.facilityType === 'SCHOOL_HOSTEL') vulnerabilityWeight = 8.8;

    const daysScore = Math.min(10, formData.daysWithoutWater * 2.2);
    const complaintDensity = 7.5;
    const facilityWeight =
      formData.facilityType === 'HOSPITAL_CLINIC' ? 10.0 : formData.facilityType === 'SLUM_COMMUNITY' ? 9.0 : 6.0;

    const compositeScore = Number(
      (vulnerabilityWeight * 0.35 + daysScore * 0.30 + complaintDensity * 0.15 + facilityWeight * 0.20).toFixed(1)
    );

    let priorityLevel = 'LOW';
    if (compositeScore >= 8.5) priorityLevel = 'CRITICAL';
    else if (compositeScore >= 7.0) priorityLevel = 'HIGH';
    else if (compositeScore >= 5.0) priorityLevel = 'MEDIUM';

    return {
      score: compositeScore,
      level: priorityLevel,
      factors: {
        vulnerability: vulnerabilityWeight,
        daysWithoutWater: formData.daysWithoutWater,
        complaintDensity,
        facilityCriticality: facilityWeight,
        compositeScore,
      },
    };
  };

  const preview = calculatePreviewScore();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await requestService.createRequest(formData);
      setCreatedRequest(res);
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '840px' }}>
        {/* Step Indicator */}
        {step < 5 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                Step {step} of 4: {step === 1 ? 'Select Delivery Location' : step === 2 ? 'Water Requirement' : step === 3 ? 'Vulnerability Factors' : 'Review & Submit'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--slate-200)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(step / 4) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary-600)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Wizard Form Container */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            padding: '2rem',
          }}
        >
          {/* STEP 1: Location */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Pin Delivery Location
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Pinpoint your exact delivery address or apartment sump gate using the interactive map.
                </p>
              </div>

              <LocationPicker
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                initialAddress={formData.address}
                onLocationSelect={handleLocationSelect}
              />

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Continue to Requirement</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Water Requirement */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Water Requirement Details
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Provide accurate consumption numbers for AI optimization & OR-Tools route dispatch.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Quantity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '6px' }}>
                    Required Water Volume (Liters)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                    {[3000, 5000, 6000, 10000, 12000].map((vol) => (
                      <button
                        key={vol}
                        type="button"
                        onClick={() => setFormData({ ...formData, quantityLiters: vol })}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${formData.quantityLiters === vol ? 'var(--primary-600)' : 'var(--border-color)'}`,
                          backgroundColor: formData.quantityLiters === vol ? 'var(--primary-50)' : '#ffffff',
                          color: formData.quantityLiters === vol ? 'var(--primary-700)' : 'var(--slate-700)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {vol.toLocaleString()} L
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={formData.quantityLiters}
                    onChange={(e) => setFormData({ ...formData, quantityLiters: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                    }}
                    min={500}
                    max={30000}
                  />
                </div>

                {/* People Affected */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '6px' }}>
                    Number of People / Residents Affected
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--slate-400)' }}>
                      <Users size={18} />
                    </div>
                    <input
                      type="number"
                      value={formData.peopleAffected}
                      onChange={(e) => setFormData({ ...formData, peopleAffected: Number(e.target.value) })}
                      placeholder="e.g. 45"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                      }}
                      min={1}
                    />
                  </div>
                </div>

                {/* Days Without Water */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '6px' }}>
                    Consecutive Days Without Municipal Supply
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--slate-400)' }}>
                      <Calendar size={18} />
                    </div>
                    <input
                      type="number"
                      value={formData.daysWithoutWater}
                      onChange={(e) => setFormData({ ...formData, daysWithoutWater: Number(e.target.value) })}
                      placeholder="e.g. 4"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        outline: 'none',
                      }}
                      min={0}
                      max={30}
                    />
                  </div>
                  <span style={{ fontSize: '0.725rem', color: '#be123c', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                    ⚠️ Note: Requests with ≥3 days dry receive accelerated AI priority weight.
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--slate-600)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Continue to Vulnerability Info</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Vulnerability & Facility Type */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Facility & Vulnerability Assessment
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  AquaEquity uses these factors to ensure fair and equitable distribution to high-risk communities.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Facility Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '6px' }}>
                    Community / Facility Category
                  </label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="HOUSEHOLD">Residential Household / Apartment Housing Society</option>
                    <option value="SLUM_COMMUNITY">Slum Cluster / Informal High-Density Settlement</option>
                    <option value="HOSPITAL_CLINIC">Hospital / Medical Clinic / Dialysis Unit</option>
                    <option value="SCHOOL_HOSTEL">School / College Hostel / Childcare Facility</option>
                    <option value="RELIEF_CAMP">Drought / Disaster Relief Center</option>
                    <option value="COMMUNITY_WELL">Public Standpost / Community Well Cluster</option>
                  </select>
                </div>

                {/* Vulnerable Members Toggle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: formData.hasInfantsOrElderly ? 'var(--primary-50)' : 'var(--slate-50)',
                    border: `1.5px solid ${formData.hasInfantsOrElderly ? 'var(--primary-300)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HeartHandshake size={22} color={formData.hasInfantsOrElderly ? 'var(--primary-600)' : 'var(--slate-400)'} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        Vulnerable Population Present
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        Includes infants, senior citizens (65+), pregnant women, or bedridden patients
                      </div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.hasInfantsOrElderly}
                    onChange={(e) => setFormData({ ...formData, hasInfantsOrElderly: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '6px' }}>
                    Specific Ground Situation & Urgency Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Sump is completely empty, 8 senior citizens in residence..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--slate-600)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Review AI Scoring</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & AI Priority Breakdown */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Review & AI Priority Preview
                </h2>
                <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  Verify your request details. The AI dynamic scoring model has computed your allocation priority below.
                </p>
              </div>

              {/* Priority Score Card Preview */}
              <div style={{ marginBottom: '1.5rem' }}>
                <PriorityScoreCard factors={preview.factors} score={preview.score} level={preview.level} />
              </div>

              {/* Summary Table */}
              <div
                style={{
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Delivery Address:</span>
                  <strong style={{ color: 'var(--slate-900)', textAlign: 'right' }}>{formData.address}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Requested Quantity:</span>
                  <strong style={{ color: 'var(--slate-900)' }}>{formData.quantityLiters.toLocaleString()} Liters</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>People Affected:</span>
                  <strong style={{ color: 'var(--slate-900)' }}>{formData.peopleAffected} persons</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Days Without Line Supply:</span>
                  <strong style={{ color: '#be123c' }}>{formData.daysWithoutWater} consecutive days</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Facility Type:</span>
                  <strong style={{ color: 'var(--slate-900)' }}>{formData.facilityType}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--slate-600)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Sparkles size={18} />
                  <span>{loading ? 'Submitting to Dispatcher...' : 'Submit Water Request'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success Screen */}
          {step === 5 && createdRequest && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Water Request Registered!
              </h2>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-700)', marginTop: '4px' }}>
                Request ID: #{createdRequest.id}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', maxWidth: '440px', margin: '0.75rem auto 1.5rem', lineHeight: 1.4 }}>
                Your request has been prioritized by the AquaEquity AI Engine with priority score{' '}
                <strong>{createdRequest.priorityScore} / 10 ({createdRequest.priorityLevel})</strong>.
                Nearest optimal tanker is being scheduled via OR-Tools.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate('/citizen')}
                  style={{
                    backgroundColor: 'var(--slate-100)',
                    color: 'var(--slate-800)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Return to Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/citizen/requests')}
                  style={{
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  View All Requests
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
