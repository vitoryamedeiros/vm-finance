"use client";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-16">
        
        {/* HERO SECTION */}
        <motion.section 
          className="flex flex-col gap-8 max-w-5xl items-center relative"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary blur-[100px] opacity-20 transform rounded-full pointer-events-none" />
          
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-foreground/5 px-4 py-2 text-sm font-bold uppercase tracking-widest border-2 border-foreground/10 rounded-none mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Finanças Simplificadas
          </motion.div>
          
          <motion.h1 variants={itemVars} className="text-7xl md:text-9xl lg:text-[10rem] font-heading text-foreground uppercase tracking-tighter leading-[0.8] text-balance">
            Domine <span className="text-primary block">Seu Dinheiro.</span>
          </motion.h1>
          
          <motion.p variants={itemVars} className="text-xl md:text-3xl font-medium max-w-3xl text-foreground/80 mt-6 leading-relaxed">
            VM Finance transcende planilhas. Escreva em linguagem natural. Acompanhe metas. Viva sua vida, a gente categoriza os gastos pra você.
          </motion.p>
          
          <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto z-10">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="brutal" className="w-full h-16 text-xl px-12 gap-2 group">
                ACESSAR DASHBOARD 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* FEATURES TEASER */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl pt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center p-8 border-4 border-foreground/5 hover:border-foreground/20 transition-colors bg-white">
            <div className="h-16 w-16 bg-primary/10 text-primary flex items-center justify-center mb-6 border-2 border-primary">
              <Zap size={32} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-3">Input Inteligente</h3>
            <p className="text-muted-foreground font-medium">Escreva "gastei 50 no uber" e nós entendemos a categoria, valor e método automaticamente.</p>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center p-8 border-4 border-foreground/5 hover:border-foreground/20 transition-colors bg-white">
            <div className="h-16 w-16 bg-primary text-white flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#111]">
              <Sparkles size={32} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-3">Insights Únicos</h3>
            <p className="text-muted-foreground font-medium">Algoritmo inteligente que analisa seus padrões de consumo e emite alertas customizados.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center p-8 border-4 border-foreground/5 hover:border-foreground/20 transition-colors bg-white">
            <div className="h-16 w-16 bg-foreground text-white flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-3">Segurança Total</h3>
            <p className="text-muted-foreground font-medium">Controle total dos seus dados. Sem conexões obscuras, sem venda de informações.</p>
          </motion.div>
        </motion.section>
        
      </main>
    </div>
  );
}
