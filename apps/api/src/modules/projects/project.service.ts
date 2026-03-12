import { PrismaClient } from "@prisma/client"

export const createProject = async (
    prisma: PrismaClient, userId: string, data: { name: string, description: string, openToContributions: boolean, liveLink?: string, githubLink?: string, imageUrl?: string }) => {
    return prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            openToContributions: data.openToContributions,
            liveLink: data.liveLink,
            githubLink: data.githubLink,
            imageUrl: data.imageUrl,
            userId: userId
        }
    })
}
export async function getProjectsByUserId(
    prisma: PrismaClient,
    userId: string
) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getProjects(
    prisma: PrismaClient,
    input: { cursor?: string | null; limit: number }
) {
    const projects = await prisma.project.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    avatarUrl: true
                }
            }
        }
    });

    const nextCursor = projects.length > input.limit ? projects.pop()?.id : null;

    return {
        projects,
        nextCursor,
    };
}

export async function deleteProject(
  prisma: PrismaClient,
  userId: string,
  input: { id: string }
) {
  const project = await prisma.project.findUnique({
    where: { id: input.id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // security check
  if (project.userId !== userId) {
    throw new Error("Unauthorized to delete this project");
  }

  return prisma.project.delete({
    where: { id: input.id },
  });
}

export async function editProject(
    prisma: PrismaClient,
    userId: string,
    input: { id: string; name?: string; description?: string; openToContributions?: boolean; liveLink?: string; githubLink?: string; imageUrl?: string; }
) {
    const project = await prisma.project.findUnique({ where: { id: input.id } });
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Unauthorized");

    return prisma.project.update({
        where: { id: input.id },
        data: {
            name: input.name,
            description: input.description,
            openToContributions: input.openToContributions,
            liveLink: input.liveLink,
            githubLink: input.githubLink,
            imageUrl: input.imageUrl
        }
    });
}