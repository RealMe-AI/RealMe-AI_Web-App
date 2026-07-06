import SpinnerIcon from "../../components/icons/SpinnerIcon";

export function LoadingState() {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <SpinnerIcon className="h-8 w-8 text-indigo-500" />
        </div>
      </div>
    );
}