import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import './CharitySignup.css';

// Define a type for the charity form data (for reference)
export type CharityFormData = {
  organizationName: string;
  orgType: string;
  registeredCountry: string;
  businessId: string;
  email: string;
  password: string;
  website: string;
  description: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  documentType: string;
  documentFile: File | null;
  kycStatus: 'pending' | 'approved' | 'rejected';
  isVerified: boolean; // New property to track overall verification status
};

interface CharitySignupProps {
  // onSuccess can be used to navigate after a successful signup
  onSuccess: () => void;
}

const orgTypes = ['NGO', 'Non-Profit', 'Foundation'];

const countries = [
  'United States', 
  'United Kingdom', 
  'Canada', 
  'Australia', 
  'Germany', 
  'France', 
  'Japan', 
  'India', 
  'China', 
  'Brazil',
  'Malaysia',
  'Singapore'
];

const CharitySignup: React.FC<CharitySignupProps> = ({ onSuccess }) => {
  const { signup } = useAuth();

  const [step, setStep] = useState<'basic' | 'verification' | 'kyc'>('basic');
  const [formData, setFormData] = useState<CharityFormData>({
    organizationName: '',
    orgType: '',
    registeredCountry: '',
    businessId: '',
    email: '',
    password: '',
    website: '',
    description: '',
    address: '',
    contactPerson: '',
    contactPhone: '',
    documentType: 'registration',
    documentFile: null,
    kycStatus: 'pending',
    isVerified: false // Initially set to false
  });

  const [error, setError] = useState('');
  const [businessIdError, setBusinessIdError] = useState('');
  const [businessIdValid, setBusinessIdValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVerifyingId, setIsVerifyingId] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const verifyBusinessId = async (businessId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(businessId === '012345');
      }, 1000);
    });
  };

  useEffect(() => {
    if (formData.businessId.trim() === '') {
      setBusinessIdError('');
      setBusinessIdValid(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (formData.businessId.length >= 4) {
        setIsVerifyingId(true);
        try {
          const isValid = await verifyBusinessId(formData.businessId);
          if (isValid) {
            setBusinessIdValid(true);
            setBusinessIdError('');
          } else {
            setBusinessIdValid(false);
            setBusinessIdError('Invalid Business ID. Please check your registration number.');
          }
        } catch (err) {
          setBusinessIdValid(false);
          setBusinessIdError(`Error: ${err instanceof Error ? err.message : 'Error verifying business ID'}`);
        } finally {
          setIsVerifyingId(false);
        }
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData.businessId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, documentFile: e.target.files?.[0] || null }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!businessIdValid) {
        setError('Please enter a valid Business ID before continuing.');
        setLoading(false);
        return;
      }
      setStep('verification');
    } catch (err: unknown) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.documentFile) {
      setError('Please upload a document');
      return;
    } else if (!accepted) {
      setError('You must agree to send the document for verification.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate document verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('kyc');
    } catch (err: unknown) {
      setError(`Error during verification: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Instead of calling login in the parent later, we use signup here to create the charity account.
  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate additional KYC/KYB delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set isVerified to true once the process is completed successfully.
      setFormData(prev => ({ ...prev, isVerified: true, kycStatus: 'approved' }));
      
      await signup(
        formData.email,
        formData.password,
        'charity',
        {
          organizationName: formData.organizationName,
          orgType: formData.orgType,
          registeredCountry: formData.registeredCountry,
          businessId: formData.businessId,
          website: formData.website,
          description: formData.description,
          address: formData.address,
          contactPerson: formData.contactPerson,
          contactPhone: formData.contactPhone,
        }
      );
      onSuccess(); // Signifies successful signup; parent can navigate further.
    } catch (err: unknown) {
      setError(`Error completing registration: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="charity-signup">
      {step === 'basic' && (
        <form onSubmit={handleBasicSubmit} className="signup-form">
          <div className="form-group">
            <label>Organization Name</label>
            <input type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Organisation Type</label>
            <select name="orgType" value={formData.orgType} onChange={handleInputChange} required>
              <option value="">Select organization type</option>
              {orgTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
      
          <div className="form-group">
            <label>Country of registration</label>
            <select name="registeredCountry" value={formData.registeredCountry} onChange={handleInputChange} required>
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
      
          <div className="form-group">
            <label>Business Registration ID</label>
            <input
              type="text"
              name="businessId"
              value={formData.businessId}
              onChange={handleInputChange}
              required
              placeholder="Enter your business registration number"
              className={businessIdValid ? 'valid-input' : businessIdError ? 'invalid-input' : ''}
            />
            {isVerifyingId && <small className="verifying" style={{ display: 'block', marginTop: '5px'}}>Verifying...</small>}
            {businessIdError && <small className="error" style={{color: 'red', display: 'block', marginTop: '5px'}}>{businessIdError}</small>}
            {businessIdValid && <small className="success" style={{color: 'green', display: 'block', marginTop: '5px'}}>✓ Business ID verified</small>}
          </div>
      
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Website (optional)</label>
            <input type="url" name="website" value={formData.website} onChange={handleInputChange} />
          </div>
      
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Contact Person</label>
            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required />
          </div>
      
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required />
          </div>
      
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className='continue-button' disabled={loading || isVerifyingId}>
            {loading ? 'Verifying...' : 'Continue to Verification'}
          </button>
        </form>
      )}

      {step === 'verification' && (
        <form onSubmit={handleVerificationSubmit} className="verification-form">
          <h3>Organization Verification</h3>
          <p>Please upload official documents to verify your organization's identity.</p>

          <div className="form-group">
            <label>Upload Official Document</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
            <small>Accepted formats: PDF, JPG, PNG (max 5MB)</small>
          </div>

          <p style={{ color: 'blue' }} className="tickbox">
            <input
              type="checkbox"
              id="accept"
              style={{ maxWidth: '15px' }}
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              required
            />
            <label htmlFor="accept" style={{ marginLeft: '8px' }}>
              <small>I acknowledge and agree that the document will be sent to KYC/KYB provider for verification.</small>
            </label>
          </p>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Submit for Verification'}
          </button>
        </form>
      )}

      {step === 'kyc' && (
        <form onSubmit={handleKYCSubmit} className="kyc-form">
          <h3>KYC/KYB Verification</h3>
          <p>Your documents have been submitted for verification. This process typically takes 1-2 business days.</p>
          <p>You will receive an email notification once the verification is complete.</p>

          <div className="verification-status">
            <div className="status-item">
              <span className="status-label">Business ID Verification:</span>
              <span className="status-value success">✓ Verified</span>
            </div>
            <div className="status-item">
              <span className="status-label">KYC/KYB Status:</span>
              <span className="status-value pending">In Progress</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CharitySignup;
