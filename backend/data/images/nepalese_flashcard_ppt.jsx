import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Presentation() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 text-gray-900 p-10">
      {/* Title Slide */}
      <motion.div
        className="h-screen flex flex-col justify-center items-center text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold mb-4 text-orange-600">
          Nepalese Culture Based English Word Flashcard
        </h1>
        <p className="text-xl">An AI-powered Learning Tool for ECD Children</p>
      </motion.div>

      {/* Team Introduction */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">👥 Team Introduction & Roles</h2>
        <ul className="list-disc ml-6 text-lg">
          <li>Member A – Backend & AI Integration (FastAPI, Gemini AI)</li>
          <li>Member B – Frontend Development (React.js, CSS)</li>
          <li>Member C – Design & User Experience (Figma, Flow Design)</li>
        </ul>
      </motion.div>

      {/* Problem Definition */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">📌 Problem Definition</h2>
        <p className="text-lg mb-4">
          Early Childhood Development (ECD) learners in Nepal lack culturally relevant English learning resources.
          Most tools miss local context, making it hard for children to connect and learn effectively.
        </p>
      </motion.div>

      {/* Solution & Features */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">💡 Solution & Features</h2>
        <ul className="grid grid-cols-2 gap-4 text-lg">
          <li>📖 Flashcards – 5 categories with images & examples</li>
          <li>📝 Quiz – Easy, Medium, Hard levels</li>
          <li>⭐ Favorite words – Save important flashcards</li>
          <li>📚 Story Creator – AI helps build stories</li>
          <li>🤖 AI Review – Personalized feedback by grade</li>
        </ul>
      </motion.div>

      {/* Target Users */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">🎯 Target Users</h2>
        <ul className="list-disc ml-6 text-lg">
          <li>Primary: ECD Students (ages 4–8)</li>
          <li>Secondary: Parents & Teachers</li>
        </ul>
      </motion.div>

      {/* Tech Stack */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">⚙️ Tech Stack & Architecture</h2>
        <ul className="list-disc ml-6 text-lg">
          <li>Frontend: React.js + CSS</li>
          <li>Backend: FastAPI (Python)</li>
          <li>AI: Google Gemini API</li>
          <li>Deployment: AWS EC2</li>
        </ul>
      </motion.div>

      {/* Future Plans */}
      <motion.div className="h-screen flex flex-col justify-center" initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">🚀 Future Plans</h2>
        <ul className="list-disc ml-6 text-lg">
          <li>Expand categories with more Nepali cultural elements</li>
          <li>AI speech recognition for story creation</li>
          <li>Multiplayer quiz mode</li>
          <li>Offline support for rural schools</li>
        </ul>
      </motion.div>

      {/* Appendix */}
      <motion.div className="h-screen flex flex-col justify-center items-center text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
        <h2 className="text-3xl font-bold mb-6 text-orange-700">📎 Appendix</h2>
        <p className="text-lg">GitHub | Figma | Deployed Service (AWS EC2) | Notion</p>
        <Button className="mt-6">Thank You 🙏</Button>
      </motion.div>
    </div>
  );
}
