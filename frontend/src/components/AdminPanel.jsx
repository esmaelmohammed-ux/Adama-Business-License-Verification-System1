import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createBusiness,
  deleteBusiness,
  fetchBusinesses,
  updateBusiness,
} from '../api/adminApi';
import { useLanguage } from '../context/LanguageContext';
const emptyForm = {
  license_number: '',
  owner_name: '',
  sub_city: '',
  expiry_date: '',
  payment_status: 'Paid',
  balance_due: 0,
};

// comme
function AdminPanel() {
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const loadBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchBusinesses();
      setBusinesses(data);
    } catch {
      setError(t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (business) => {
    setEditingId(business.id);
    setForm({
      license_number: business.license_number,
      owner_name: business.owner_name,
      sub_city: business.sub_city,
      expiry_date: business.expiry_date,
      payment_status: business.payment_status,
      balance_due: business.balance_due,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await updateBusiness(editingId, form);
      } else {
        await createBusiness(form);
      }
      closeForm();
      await loadBusinesses();
    } catch (err) {
      setError(err.message || t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;

    try {
      await deleteBusiness(id);
      await loadBusinesses();
    } catch {
      setError(t('deleteError'));
    }
  };

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <div>
          <h1>{t('adminTitle')}</h1>
          <p className="app-subtitle">{t('adminSubtitle')}</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="btn btn-outline">{t('backToAudit')}</Link>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            {t('addBusiness')}
          </button>
        </div>
      </header>

      {error && <p className="form-error admin-error" role="alert">{error}</p>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? t('editBusiness') : t('addBusiness')}</h2>
          <div className="form-grid">
            <label>
              {t('licenseNumber')}
              <input
                value={form.license_number}
                onChange={(e) => handleChange('license_number', e.target.value)}
                required
              />
            </label>
            <label>
              {t('owner')}
              <input
                value={form.owner_name}
                onChange={(e) => handleChange('owner_name', e.target.value)}
                required
              />
            </label>
            <label>
              {t('subCity')}
              <input
                value={form.sub_city}
                onChange={(e) => handleChange('sub_city', e.target.value)}
                required
              />
            </label>
            <label>
              {t('expiry')}
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => handleChange('expiry_date', e.target.value)}
                required
              />
            </label>
            <label>
              {t('status')}
              <select
                value={form.payment_status}
                onChange={(e) => handleChange('payment_status', e.target.value)}
              >
                <option value="Paid">{t('paid')}</option>
                <option value="Expired">{t('expired')}</option>
              </select>
            </label>
            <label>
              {t('balanceDueField')}
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.balance_due}
                onChange={(e) => handleChange('balance_due', e.target.value)}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-loading">…</p>
      ) : businesses.length === 0 ? (
        <p className="admin-empty">{t('noBusinesses')}</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('license')}</th>
                <th>{t('owner')}</th>
                <th>{t('subCity')}</th>
                <th>{t('status')}</th>
                <th>{t('balanceDue')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id}>
                  <td>{business.license_number}</td>
                  <td>{business.owner_name}</td>
                  <td>{business.sub_city}</td>
                  <td>
                    <span className={`status-pill status-${business.payment_status.toLowerCase()}`}>
                      {business.payment_status === 'Paid' ? t('paid') : t('expired')}
                    </span>
                  </td>
                  <td>{Number(business.balance_due).toLocaleString()} ETB</td>
                  <td className="table-actions">
                    <button type="button" className="btn btn-small" onClick={() => openEdit(business)}>
                      {t('editBusiness')}
                    </button>
                    <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(business.id)}>
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;



