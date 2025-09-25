import React, { useEffect, useMemo, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave } from 'react-icons/fa';
import { authAPI } from '../../services/api';

const UserProfile = () => {
  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  const [profile, setProfile] = useState({
    fullName: storedUser?.fullName || storedUser?.name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    address: storedUser?.address || ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // If backend supports, fetch fresh profile
        const { data } = await authAPI.getUserProfile().catch(() => ({ data: null }));
        if (data) {
          setProfile({
            fullName: data.fullName || data.name || profile.fullName || '',
            email: data.email || profile.email || '',
            phone: data.phone || profile.phone || '',
            address: data.address || profile.address || ''
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Persist locally so user sees updates immediately
      try {
        const u = JSON.parse(localStorage.getItem('user') || 'null') || {};
        u.fullName = profile.fullName;
        u.name = profile.fullName || u.name;
        u.phone = profile.phone;
        u.address = profile.address;
        localStorage.setItem('user', JSON.stringify(u));
      } catch {}

      // If backend exposes an endpoint, it can be invoked here.
      // await authAPI.updateUserProfile(profile);
      alert('Profile saved');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded" style={{backgroundColor: '#198754', color: 'white'}}>
        <div>
          <h2 className="mb-1 text-white">USER DASHBOARD</h2>
          <p className="mb-0 text-white-50">Manage your profile and settings</p>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="card-title mb-4">Profile</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">
                  <FaUser className="me-2 text-muted" /> Full Name
                </label>
                <input className="form-control" name="fullName" value={profile.fullName||''} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <FaEnvelope className="me-2 text-muted" /> Email
                </label>
                <input className="form-control" value={profile.email||''} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <FaPhone className="me-2 text-muted" /> Phone
                </label>
                <input className="form-control" name="phone" value={profile.phone||''} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">
                  <FaMapMarkerAlt className="me-2 text-muted" /> Address
                </label>
                <input className="form-control" name="address" value={profile.address||''} onChange={handleChange} />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-1" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;


