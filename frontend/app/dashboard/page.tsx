'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function DashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const access = localStorage.getItem('access');
      if (!access) {
        window.location.href = '/login';
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${access}` };
        
        // Parallel fetch
        const [meRes, studentsRes, scheduleRes] = await Promise.all([
            fetch(`${API_BASE}/api/auth/me`, { headers }),
            fetch(`${API_BASE}/api/auth/students`, { headers }),
            fetch(`${API_BASE}/api/courses/schedule/`, { headers })
        ]);

        if (!meRes.ok) throw new Error('Falha de autenticação');
        
        if (studentsRes.ok) {
            setStudents(await studentsRes.json());
        }
        if (scheduleRes.ok) {
            setSchedule(await scheduleRes.json());
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        // window.location.href = '/login'; // Let's not redirect immediately on fetch error to debug
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando painel...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Painel do Professor</h1>
        <div className="space-x-4">
            <a 
                href="http://localhost:8000/admin" 
                target="_blank" 
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
                Acessar Admin (Cadastro Completo)
            </a>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                Nova Aula (Agenda)
            </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Alunos */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-600">👥</span> Meus Alunos
            </h2>
            <div className="overflow-x-auto">
                {students.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum aluno cadastrado.</p>
                ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="py-3 px-4">Nome</th>
                            <th className="py-3 px-4">Plano</th>
                            <th className="py-3 px-4">Telefone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {students.map((student: any) => (
                            <tr key={student.id}>
                                <td className="py-3 px-4">{student.name}</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        {student.plan?.name || 'Sem plano'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{student.phone || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                <p className="mt-4 text-center text-gray-500 text-xs">
                    * A lista completa é gerenciada no Painel Admin.
                </p>
            </div>
        </div>

        {/* Card Agenda (Mock Google Calendar) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-500">📅</span> Agenda de Aulas
            </h2>
            <div className="space-y-3">
                {schedule.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhuma aula agendada para hoje em diante.</p>
                ) : (
                    schedule.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 border rounded-l-4 border-l-emerald-500 bg-emerald-50">
                            <p className="font-semibold text-emerald-900">
                                {new Date(lesson.start_time).toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm text-emerald-700">
                                Aula com {lesson.student_name} ({lesson.plan_name})
                            </p>
                            {lesson.meet_link && (
                                <a href={lesson.meet_link} target="_blank" className="text-xs underline text-emerald-600 mt-1 inline-block">
                                    Link do Meet
                                </a>
                            )}
                        </div>
                    ))
                )}
                
                <button className="w-full py-2 mt-2 text-sm text-gray-600 border border-dashed rounded hover:bg-gray-50">
                    + Sincronizar Google Calendar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
