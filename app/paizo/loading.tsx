export default function PaizoLoading() {
  return (
    <div className="container py-20 text-center relative-z flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin"></div>
      </div>
      <p className="text-amber-400 font-bold text-sm tracking-wide">
        جاري تحميل محتوى PAIZO...
      </p>
    </div>
  );
}
