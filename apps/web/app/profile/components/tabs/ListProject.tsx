import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, ExternalLink, Github, Code, Users, Trash2, Trash, Pencil } from "lucide-react";
import { AddProjectModal } from "./AddProjectModal";

interface ListProjectProps {
    userId: string;
}

export function ListProject({ userId }: ListProjectProps) {

    const utils = trpc.useUtils();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editProject, setEditProject] = useState(false);

    const { data: projects, isLoading } = trpc.projects.getProjectsByUserId.useQuery({ userId });
    const deleteProject = trpc.projects.deleteProject.useMutation({
        onSuccess: () => {
            utils.projects.getProjectsByUserId.invalidate({ userId });
            setSelectedProjectId(null);
        }
    })
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-lg">
                <p className="text-neutral-400 text-sm">No projects found.</p>
                <p className="text-xs text-neutral-500 mt-2">Projects created will appear here.</p>
            </div>
        );
    }

    // Detail View
    if (selectedProjectId) {
        const project = projects.find((p) => p.id === selectedProjectId);
        if (!project) {
            setSelectedProjectId(null);
            return null;
        }

        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                    onClick={() => setSelectedProjectId(null)}
                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-6 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </button>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    {project.imageUrl && (
                        <div className="w-full h-64 relative border-b border-neutral-800">
                            <img
                                src={project.imageUrl}
                                alt={project.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                                {project.openToContributions && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                        <Users size={12} />
                                        Open to contributions
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {project.liveLink && (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                        Live Demo
                                    </a>
                                )}
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Github size={16} />
                                        Source Code
                                    </a>
                                )}
                                <button
                                    title="Edit Project"
                                    onClick={() => setEditProject(true)}
                                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    title="Delete Project"
                                    onClick={() => setConfirmDelete(true)}
                                    className="p-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <AddProjectModal
                            isOpen={editProject}
                            onClose={() => setEditProject(false)}
                            project={project}
                        />

                        {confirmDelete && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-[320px] animate-in fade-in zoom-in-95">

                                    <h3 className="text-white text-lg font-semibold mb-2">
                                        Delete Project
                                    </h3>

                                    <p className="text-sm text-neutral-400 mb-6">
                                        Are you sure you want to delete this project? This action cannot be undone.
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setConfirmDelete(false)}
                                            className="px-4 py-2 text-sm rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => {
                                                deleteProject.mutate({ id: project.id });
                                                setConfirmDelete(false);
                                            }}
                                            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-lg font-semibold text-white mb-3">About the Project</h3>
                            <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List View
    const displayProjects = showAll ? projects : projects.slice(0, 4);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayProjects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer hover:border-neutral-700 transition-all hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5"
                    >
                        {project.imageUrl ? (
                            <div className="w-full h-40 border-b border-neutral-800 overflow-hidden relative">
                                <img
                                    src={project.imageUrl}
                                    alt={project.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : (
                            <div className="w-full h-40 bg-neutral-800/50 border-b border-neutral-800 flex items-center justify-center relative overflow-hidden">
                                <Code size={48} className="text-neutral-700 transition-transform duration-500 group-hover:scale-110 group-hover:text-neutral-600" />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                                {project.name}
                            </h3>
                            <p className="text-sm text-neutral-400 mb-4 line-clamp-2 flex-1">
                                {project.description}
                            </p>
                            <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-neutral-800/50">
                                <span className="text-neutral-500 font-medium">View details <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span></span>
                                {project.openToContributions && (
                                    <span className="flex items-center gap-1 text-green-500">
                                        <Users size={12} />
                                        Open
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length > 4 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-3 mt-2 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-colors font-medium text-sm text-center"
                >
                    {showAll ? "Show less" : `Show all ${projects.length} projects`}
                </button>
            )}
        </div>
    );
}
