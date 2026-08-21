// AquaEquity Hackathon Demo Simulation Controller Context (JavaScript)
import { createContext, useContext, useState } from 'react';
import { mockStateManager } from '../services/mockStateManager';
import { emergencyService } from '../services/emergencyService';
import { deliveryService } from '../services/deliveryService';
import { useNavigate } from 'react-router-dom';

const DemoSimulationContext = createContext(null);

export const DemoSimulationProvider = ({ children }) => {
  const [isDemoBarVisible, setIsDemoBarVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const navigate = useNavigate();

  const runStep1_CreateCitizenRequest = () => {
    setIsExecuting(true);
    setCurrentStep(1);
    setLastMessage('Submitting High Priority Citizen Water Request...');
    const req = mockStateManager.createRequest({
      citizenId: 'usr-cit-101',
      citizenName: 'Ramesh Jadhav',
      citizenPhone: '+91 98765 43210',
      address: 'Mayur Colony, Kothrud, Pune',
      latitude: 18.5074,
      longitude: 73.8077,
      quantityLiters: 6000,
      peopleAffected: 45,
      daysWithoutWater: 4,
      facilityType: 'HOUSEHOLD',
      hasInfantsOrElderly: true,
      notes: 'Storage completely dry. 8 senior citizens in residence.',
    });
    setIsExecuting(false);
    setLastMessage(`Step 1 Done: Request #${req.id} created with AI Score ${req.priorityScore} (${req.priorityLevel})!`);
    navigate('/citizen');
  };

  const runStep2_AssignTanker = () => {
    setIsExecuting(true);
    setCurrentStep(2);
    setLastMessage('AI Dispatcher (OR-Tools) selecting nearest optimal tanker...');
    try {
      const assignment = mockStateManager.assignTankerToRequest('REQ-1024', 'tnk-101');
      setLastMessage('Step 2 Done: Tanker MH-12-AB-1234 assigned! Driver is en route.');
      navigate(`/citizen/track/${assignment.id}`);
    } catch (e) {
      setLastMessage('Error: ' + e.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const runStep3_TriggerHospitalEmergency = async () => {
    setIsExecuting(true);
    setCurrentStep(3);
    setLastMessage('Triggering Hospital Emergency Override at Ruby Hall Clinic...');
    try {
      await emergencyService.triggerOverride('EMG-901');
      setLastMessage('Step 3 Done: Active tanker redirected to Hospital! Standby Tanker MH-12-CD-5678 assigned as replacement.');
    } catch (e) {
      setLastMessage('Error: ' + e.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const runStep4_SimulateArrivalAndGeofence = async () => {
    setIsExecuting(true);
    setCurrentStep(4);
    setLastMessage('Simulating replacement tanker arrival within 50m geofence...');
    try {
      await deliveryService.simulateGeofenceArrival('asg-demo-1');
      setLastMessage('Step 4 Done: Geofence verified! Tanker arrived at destination.');
      navigate('/citizen/delivery/asg-demo-1');
    } catch (e) {
      setLastMessage('Error: ' + e.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const runStep5_VerifyOtpAndComplete = async () => {
    setIsExecuting(true);
    setCurrentStep(5);
    setLastMessage('Verifying Delivery OTP (849201) & Water Potability sensor...');
    try {
      const res = await deliveryService.verifyOtp({
        assignmentId: 'asg-demo-1',
        otpCode: '849201',
      });
      if (res.success) {
        setLastMessage('Step 5 Done: OTP Verified! 6,000L dispensed. Delivery completed.');
      } else {
        setLastMessage('OTP verification failed: ' + res.message);
      }
    } catch (e) {
      setLastMessage('Error: ' + e.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const resetSimulation = () => {
    mockStateManager.resetToDefaults();
    setCurrentStep(1);
    setLastMessage('Demo state reset to initial conditions.');
  };

  const markStep5Verified = () => {
    setCurrentStep(5);
    setLastMessage('Step 5 Done: OTP Verified! 6,000L dispensed. Delivery completed.');
  };

  return (
    <DemoSimulationContext.Provider
      value={{
        isDemoBarVisible,
        setIsDemoBarVisible,
        currentStep,
        isExecuting,
        lastMessage,
        runStep1_CreateCitizenRequest,
        runStep2_AssignTanker,
        runStep3_TriggerHospitalEmergency,
        runStep4_SimulateArrivalAndGeofence,
        runStep5_VerifyOtpAndComplete,
        resetSimulation,
        markStep5Verified,
      }}
    >
      {children}
    </DemoSimulationContext.Provider>
  );
};

export const useDemoSimulation = () => {
  const context = useContext(DemoSimulationContext);
  if (!context) throw new Error('useDemoSimulation must be used within DemoSimulationProvider');
  return context;
};
