import React from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <section className="relative overflow-hidden py-20  h-[calc(100vh-72px)]">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 flex flex-col items-center gap-16">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white">Pricing</h2>
          <p className="mt-3 text-slate-400">
            Simple pricing based on credits usage
          </p>
        </div>

        {/* Plans */}
        <div className="flex flex-wrap gap-10 justify-center w-full">

          {/* STARTER */}
          <div className="w-full max-w-sm rounded-2xl p-6 pb-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Starter</h3>
              <p className="text-slate-400">For beginners</p>

              <p className="mt-4 text-2xl font-bold text-white">
                ₹500 <span className="text-sm text-slate-400">/ 200 credits</span>
              </p>

              <button className="mt-6 w-full rounded-lg bg-white text-slate-900 py-2.5 font-semibold hover:bg-slate-200">
                Buy Credits
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-400" /> Basic AI usage
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-400" /> Limited previews
              </div>
            </div>
          </div>

          {/* PRO */}
          <div className="w-full max-w-sm rounded-2xl p-6 pb-10 bg-indigo-600/20 backdrop-blur-xl border border-indigo-400/30 shadow-2xl scale-105">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <p className="text-indigo-200/70">Most popular</p>

              <p className="mt-4 text-2xl font-bold text-white">
                ₹1500 <span className="text-sm text-indigo-300/60">/ 800 credits</span>
              </p>

              <button className="mt-6 w-full rounded-lg bg-indigo-500 py-2.5 font-semibold text-white hover:bg-indigo-400">
                Upgrade
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-indigo-100">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-indigo-300" /> Unlimited AI usage
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-indigo-300" /> Live previews
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-indigo-300" /> Priority support
              </div>
            </div>
          </div>

          {/* ENTERPRISE */}
          <div className="w-full max-w-sm rounded-2xl p-6 pb-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Enterprise</h3>
              <p className="text-slate-400">Custom needs</p>

              <p className="mt-4 text-2xl font-bold text-white">
                Custom <span className="text-sm text-slate-400">pricing</span>
              </p>

              <button className="mt-6 w-full rounded-lg bg-white text-slate-900 py-2.5 font-semibold hover:bg-slate-200">
                Contact Sales
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-400" /> Unlimited credits
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-400" /> Team access
              </div>
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-400" /> Dedicated manager
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;
