import React, { useEffect, useMemo, useState } from 'react';
import { ngoAPI } from '../../services/api';

const ALL_CAUSES = [
  'Education','Healthcare','Environment','Women Empowerment','Child Welfare','Disaster Relief','Animals','Elderly','Arts & Culture'
];

const NGORegisterForm = () => {
  const storedUser = useMemo(() => { try { return JSON.parse(localStorage.getItem('user')||'null'); } catch { return null; } }, []);

  // Try to get stored NGO profile from localStorage
  const getStoredNGOProfile = () => {
    try {
      const storedProfile = localStorage.getItem('ngoProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        console.log('Found stored NGO profile:', profile);
        return {
          organizationName: profile.organizationName || '',
          registrationNumber: profile.registrationNumber || '',
          registrationId: profile.registrationId || '',
          description: profile.description || '',
          location: profile.location || '',
          address: profile.address || '',
          email: profile.email || '',
          phone: profile.phone || '',
          website: profile.website || '',
          pointOfContactName: profile.pointOfContactName || '',
          pointOfContactPhone: profile.pointOfContactPhone || '',
          facebookUrl: profile.facebookUrl || '',
          instagramUrl: profile.instagramUrl || '',
          linkedinUrl: profile.linkedinUrl || '',
          causes: profile.causes || [],
          cause: profile.cause || ''
        };
      }
    } catch (error) {
      console.error('Error parsing stored NGO profile:', error);
    }
    return null;
  };

  const [form, setForm] = useState(() => {
    const storedProfile = getStoredNGOProfile();
    if (storedProfile) return storedProfile;
    
    return {
      organizationName: '',
      registrationNumber: '',
      registrationId: '',
      description: '',
      location: '',
      address: '',
      email: storedUser?.email || '',
      phone: '',
      website: '',
      pointOfContactName: '',
      pointOfContactPhone: '',
      facebookUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      causes: [],
      cause: ''
    };
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!form.cause && form.causes.length > 0) {
      setForm((f) => ({ ...f, cause: f.causes[0] }));
    }
  }, [form.causes, form.cause]);

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        if (storedUser?.email) {
          console.log('Fetching NGO data for email:', storedUser.email);
          // Try to fetch NGO data by email first
          try {
            const response = await ngoAPI.getByEmail(storedUser.email);
            const ngoData = response?.data;
            
            if (ngoData) {
              console.log('Fetched NGO data by email:', ngoData);
              setForm(prev => ({
                ...prev,
                organizationName: ngoData.organizationName || '',
                registrationNumber: ngoData.registrationNumber || '',
                registrationId: ngoData.registrationId || '',
                description: ngoData.description || '',
                location: ngoData.location || '',
                address: ngoData.address || '',
                email: ngoData.email || storedUser.email || '',
                phone: ngoData.phone || '',
                website: ngoData.website || '',
                pointOfContactName: ngoData.pointOfContactName || '',
                pointOfContactPhone: ngoData.pointOfContactPhone || '',
                facebookUrl: ngoData.facebookUrl || '',
                instagramUrl: ngoData.instagramUrl || '',
                linkedinUrl: ngoData.linkedinUrl || '',
                causes: ngoData.causes || [],
                cause: ngoData.cause || ''
              }));
              return; // Exit if we found NGO by email
            }
          } catch (emailError) {
            console.log('No NGO found by email, trying organization name...');
          }
        }
        
        // Fallback to organization name if email lookup fails or no email
        if (storedUser?.organizationName || storedUser?.name) {
          const orgName = storedUser.organizationName || storedUser.name;
          const { data: ngoData } = await ngoAPI.getByOrganizationName(orgName);
          
          if (ngoData) {
            setForm(prev => ({
              ...prev,
              organizationName: ngoData.organizationName || orgName || '',
              registrationNumber: ngoData.registrationNumber || '',
              registrationId: ngoData.registrationId || '',
              description: ngoData.description || '',
              location: ngoData.location || '',
              address: ngoData.address || '',
              email: ngoData.email || storedUser?.email || '',
              phone: ngoData.phone || '',
              website: ngoData.website || '',
              pointOfContactName: ngoData.pointOfContactName || '',
              pointOfContactPhone: ngoData.pointOfContactPhone || '',
              facebookUrl: ngoData.facebookUrl || '',
              instagramUrl: ngoData.instagramUrl || '',
              linkedinUrl: ngoData.linkedinUrl || '',
              causes: ngoData.causes || [],
              cause: ngoData.cause || ''
            }));
            return;
          }
        }
        
        // If no NGO data found but we have user data, prefill what we can
        if (storedUser?.email || storedUser?.name) {
          setForm(prev => ({
            ...prev,
            email: storedUser.email || prev.email,
            organizationName: prev.organizationName || storedUser.name || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching NGO data:', error);
        // Fallback to basic user data if API call fails
        if (storedUser?.email || storedUser?.name) {
          setForm(prev => ({
            ...prev,
            email: storedUser.email || prev.email,
            organizationName: prev.organizationName || storedUser.name || ''
          }));
        }
      }
    };

    fetchNGOData();
  }, [storedUser]);

  const toggleCause = (cause) => {
    setForm((prev) => {
      const exists = prev.causes.includes(cause);
      const next = exists ? prev.causes.filter(c => c !== cause) : [...prev.causes, cause];
      return { ...prev, causes: next, cause: next[0] || '' };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.organizationName || !form.registrationNumber) {
      alert('NGO Name and Registration Number are required');
      return;
    }
    if (form.causes.length === 0) {
      alert('Select at least one cause');
      return;
    }
    try {
      setSaving(true);
      const payload = { ...form };
      const { data } = await ngoAPI.create(payload);
      try {
        const user = JSON.parse(localStorage.getItem('user')||'null') || {};
        user.ngoId = data.id;
        localStorage.setItem('user', JSON.stringify(user));
      } catch {}
      alert('NGO registered successfully');
      setForm({
        organizationName: '', registrationNumber: '', registrationId: '', description: '', location: '', address: '', email: '', phone: '', website: '',
        pointOfContactName: '', pointOfContactPhone: '', facebookUrl: '', instagramUrl: '', linkedinUrl: '', causes: [], cause: ''
      });
      window.location.href = '/dashboards/ngo-dashboard';
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to register NGO');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">NGO Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">NGO Name *</label>
            <input name="organizationName" value={form.organizationName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Registration Number *</label>
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Registration ID</label>
            <input name="registrationId" value={form.registrationId} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-12">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="3" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Location (City)</label>
            <input name="location" value={form.location} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Website</label>
            <input name="website" value={form.website} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-12">
            <label className="form-label">Causes *</label>
            <div className="d-flex flex-wrap gap-2">
              {ALL_CAUSES.map(cause => (
                <button type="button" key={cause} className={`btn btn-sm ${form.causes.includes(cause) ? 'btn-success' : 'btn-outline-success'}`} onClick={() => toggleCause(cause)}>
                  {cause}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Point of Contact Name</label>
            <input name="pointOfContactName" value={form.pointOfContactName} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Point of Contact Phone</label>
            <input name="pointOfContactPhone" value={form.pointOfContactPhone} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-4">
            <label className="form-label">Facebook URL</label>
            <input name="facebookUrl" value={form.facebookUrl} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Instagram URL</label>
            <input name="instagramUrl" value={form.instagramUrl} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">LinkedIn URL</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-success" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Register NGO'}</button>
        </div>
      </form>
    </div>
  );
};

export default NGORegisterForm;
