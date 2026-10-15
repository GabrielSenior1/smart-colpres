import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { auth, rtdb } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

export default function EditActivity() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/');
      } else {
        fetchActivity();
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, activityId]);

  const fetchActivity = async () => {
    try {
      const snapshot = await get(ref(rtdb, `activities/${activityId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTitle(data.title || '');
        setSubject(data.subject || '');
        setQuestions(data.questions || []);
      } else {
        alert("Actividad no encontrada.");
        navigate('/teacher');
      }
    } catch (e) {
      console.error(e);
      alert("Error al cargar la actividad.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const activityRef = ref(rtdb, `activities/${activityId}`);
      await set(activityRef, {
        title,
        subject,
        questions
      });
      alert("Actividad guardada correctamente.");
      navigate('/teacher');
    } catch (e) {
      console.error(e);
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions, 
      {
        context: '',
        text: 'Nueva Pregunta',
        imageUrl: '',
        options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
        correctAnswerIndex: 0,
        timeLimit: 20
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm("¿Seguro que quieres eliminar esta pregunta?")) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><span className="text-primary font-bold">Cargando...</span></div>;
  }

  return (
    <div className="bg-surface-bright min-h-screen font-body-md text-on-surface p-4 md:p-8 pb-32">
      <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/teacher" className="bg-surface-container hover:bg-surface-container-highest p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-headline-md font-bold text-primary">Editar Actividad</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:brightness-110 transition-all disabled:opacity-50">
          <span className="material-symbols-outlined">save</span>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </header>

      <main className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* General Info */}
        <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant">
          <h2 className="text-label-lg font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1">Título de la Actividad</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1">Materia / Tema</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surface-container p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </section>

        {/* Questions */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-headline-sm font-bold text-primary">Preguntas ({questions.length})</h2>
            <button 
              onClick={addQuestion}
              className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-95 transition-all">
              <span className="material-symbols-outlined">add</span>
              Añadir Pregunta
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => removeQuestion(qIndex)}
                    className="text-error bg-error-container/50 hover:bg-error-container p-2 rounded-full transition-colors"
                    title="Eliminar Pregunta">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                
                <h3 className="font-bold text-primary mb-4">Pregunta {qIndex + 1}</h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Contexto (Opcional, ej: lectura previa)</label>
                    <textarea 
                      value={q.context || ''} 
                      onChange={(e) => updateQuestion(qIndex, 'context', e.target.value)}
                      className="w-full bg-surface-container p-3 rounded-lg border border-outline-variant focus:border-primary outline-none resize-y min-h-[60px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Texto de la Pregunta</label>
                    <textarea 
                      value={q.text} 
                      onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                      className="w-full bg-surface-container p-3 rounded-lg border border-primary outline-none font-bold resize-y min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">URL de Imagen (Opcional)</label>
                    <input 
                      type="url" 
                      value={q.imageUrl || ''} 
                      onChange={(e) => updateQuestion(qIndex, 'imageUrl', e.target.value)}
                      placeholder="Ej: https://ejemplo.com/imagen.jpg"
                      className="w-full bg-surface-container p-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
                    />
                    {q.imageUrl && (
                      <div className="mt-2 bg-surface-container-highest p-2 rounded-lg inline-block">
                        <img src={q.imageUrl} alt="Preview" className="max-h-32 object-contain rounded" onError={(e) => e.target.style.display='none'} onLoad={(e) => e.target.style.display='block'} />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Tiempo Límite (segundos)</label>
                    <input 
                      type="number" 
                      min="5"
                      value={q.timeLimit || 20} 
                      onChange={(e) => updateQuestion(qIndex, 'timeLimit', parseInt(e.target.value) || 20)}
                      className="w-32 bg-surface-container p-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Opciones de Respuesta</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[0, 1, 2, 3].map((optIndex) => (
                        <div key={optIndex} className={`flex items-center gap-2 p-2 rounded-lg border ${q.correctAnswerIndex === optIndex ? 'border-[#43A047] bg-[#43A047]/5' : 'border-outline-variant'}`}>
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswerIndex === optIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', optIndex)}
                            className="w-5 h-5 accent-[#43A047] cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={q.options && q.options[optIndex] ? q.options[optIndex] : ''}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            className="flex-1 bg-transparent p-2 outline-none"
                            placeholder={`Opción ${optIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
