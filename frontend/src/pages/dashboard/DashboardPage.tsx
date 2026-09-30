import AICommandInput from "../../components/ai/AICommandInput";
import AppLayout from "../../components/layout/AppLayout";
import { useAuthStore } from "../../store/auth.store";

function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}

          <div className="mb-8">
            <p className="text-sm text-slate-400">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              {user?.name ?? "User"}
            </h1>

            <p className="mt-2 text-slate-400">
              Here's what's happening with your notes.
            </p>
          </div>

          <div className="mb-10 max-w-4xl">
            <AICommandInput />
          </div>


          {/* Stats */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Notes"
              value={0}
            />

            <StatCard
              title="Pending"
              value={0}
            />

            <StatCard
              title="Completed"
              value={0}
            />
          </div>

          {/* Notes */}

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Notes
            </h2>

            <div className="flex min-h-48 items-center justify-center">
              <div className="text-center">
                <p className="text-slate-400">
                  You don't have any notes yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first note to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

type StatCardProps = {
  title: string;
  value: number;
};

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default DashboardPage;
