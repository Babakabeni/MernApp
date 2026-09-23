import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const initialForm = { title: '', description: '', status: 'À faire' };
const statuses = ['À faire', 'En cours', 'Terminée'];

const formatDate = (date) => new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit', month: 'short', year: 'numeric'
}).format(new Date(date));

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('Toutes');
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const filteredTasks = useMemo(
    () => filter === 'Toutes' ? tasks : tasks.filter((task) => task.status === filter),
    [filter, tasks]
  );

  const showNotice = (message, type = 'success') => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 3500);
  };

  const loadTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Impossible de charger les tâches.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      showNotice('Le titre est obligatoire.', 'danger');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const { data } = await axios.put(`/api/tasks/${editingId}`, form);
        setTasks((current) => current.map((task) => task._id === editingId ? data : task));
        showNotice('Tâche mise à jour avec succès.');
      } else {
        const { data } = await axios.post('/api/tasks', form);
        setTasks((current) => [data, ...current]);
        showNotice('Tâche ajoutée avec succès.');
      }
      resetForm();
    } catch (error) {
      showNotice(error.response?.data?.message || 'Une erreur est survenue.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setForm({ title: task.title, description: task.description, status: task.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (editingId === id) resetForm();
      showNotice('Tâche supprimée.');
    } catch (error) {
      showNotice(error.response?.data?.message || 'Suppression impossible.', 'danger');
    }
  };

  const countByStatus = (status) => tasks.filter((task) => task.status === status).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container app-container d-flex align-items-center justify-content-between">
          <a className="brand" href="/" aria-label="Task Manager accueil">
            <span className="brand-mark"><i className="bi bi-check2"></i></span>
            <span>Task<span>Manager</span></span>
          </a>
          <span className="workspace-label"><i className="bi bi-grid-1x2-fill me-2"></i>Mon espace de travail</span>
        </div>
      </header>

      <main className="container app-container py-4 py-lg-5">
        <section className="intro-row">
          <div>
            <p className="eyebrow">TABLEAU DE BORD</p>
            <h1>Les tâches qui font avancer<br className="d-none d-md-block" /> vos projets.</h1>
            <p className="subtitle">Organisez vos priorités, gardez le cap et célébrez chaque étape.</p>
          </div>
          <div className="date-stamp"><i className="bi bi-calendar3 me-2"></i>{formatDate(new Date())}</div>
        </section>

        <section className="stats-grid" aria-label="Résumé des tâches">
          <div className="stat-item"><span className="stat-icon all"><i className="bi bi-stack"></i></span><div><strong>{tasks.length}</strong><span>Total</span></div></div>
          <div className="stat-item"><span className="stat-icon todo"><i className="bi bi-circle"></i></span><div><strong>{countByStatus('À faire')}</strong><span>À faire</span></div></div>
          <div className="stat-item"><span className="stat-icon progress"><i className="bi bi-arrow-repeat"></i></span><div><strong>{countByStatus('En cours')}</strong><span>En cours</span></div></div>
          <div className="stat-item"><span className="stat-icon done"><i className="bi bi-check2-circle"></i></span><div><strong>{countByStatus('Terminée')}</strong><span>Terminées</span></div></div>
        </section>

        {notice && <div className={`alert alert-${notice.type} notice`} role="alert"><i className={`bi ${notice.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>{notice.message}</div>}

        <section className="workspace-grid">
          <aside className="task-form-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">{editingId ? 'MODIFICATION' : 'NOUVELLE TÂCHE'}</p><h2>{editingId ? 'Modifier la tâche' : 'Ajouter une tâche'}</h2></div>
              <span className="form-symbol"><i className={`bi ${editingId ? 'bi-pencil' : 'bi-plus-lg'}`}></i></span>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Titre <span>*</span></label>
              <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Ex. Préparer la présentation" maxLength="120" required />
              <label htmlFor="description">Description <small>Optionnel</small></label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Ajoutez quelques détails..." rows="4" maxLength="1000" />
              <label htmlFor="status">Statut</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
              <div className="form-actions">
                {editingId && <button type="button" className="btn btn-light" onClick={resetForm}>Annuler</button>}
                <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}><i className={`bi ${saving ? 'bi-arrow-repeat spin' : editingId ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>{saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter la tâche'}</button>
              </div>
            </form>
          </aside>

          <section className="tasks-panel">
            <div className="tasks-header"><div><p className="eyebrow">VOTRE ACTIVITÉ</p><h2>Liste des tâches <span>{filteredTasks.length}</span></h2></div><div className="filter-wrap"><i className="bi bi-funnel"></i><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrer les tâches"><option>Toutes</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
            {loading ? <div className="empty-state"><i className="bi bi-arrow-repeat spin"></i><p>Chargement de vos tâches...</p></div> : filteredTasks.length === 0 ? <div className="empty-state"><i className="bi bi-inbox"></i><h3>Aucune tâche ici</h3><p>Commencez par ajouter votre première tâche.</p></div> : <div className="task-list">{filteredTasks.map((task) => <article className="task-row" key={task._id}><div className={`status-dot ${task.status === 'Terminée' ? 'done' : task.status === 'En cours' ? 'progress' : 'todo'}`}></div><div className="task-content"><div className="task-title-line"><h3 className={task.status === 'Terminée' ? 'completed' : ''}>{task.title}</h3><span className={`status-badge ${task.status === 'Terminée' ? 'badge-done' : task.status === 'En cours' ? 'badge-progress' : 'badge-todo'}`}>{task.status}</span></div>{task.description && <p>{task.description}</p>}<small><i className="bi bi-clock me-1"></i>{formatDate(task.createdAt)}</small></div><div className="task-actions"><button type="button" className="icon-button" onClick={() => editTask(task)} title="Modifier"><i className="bi bi-pencil"></i></button><button type="button" className="icon-button delete" onClick={() => deleteTask(task._id)} title="Supprimer"><i className="bi bi-trash3"></i></button></div></article>)}</div>}
          </section>
        </section>
      </main>
      <footer className="footer"><span>Task Manager</span><span>Organisez. Exécutez. Avancez.</span></footer>
    </div>
  );
}

export default App;
