import { motion } from "framer-motion";
import type { PrettyCardNode } from "../types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export default function PrettyCard({ node }: { node: PrettyCardNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "3px solid #8b8fa8",
        backdropFilter: "blur(4px)",
        borderRadius: "4px",
        padding: "12px 16px",
        margin: "4px 0",
        fontFamily: 'ui-monospace,"Cascadia Code","JetBrains Mono","Fira Code",monospace',
        fontSize: "13px",
      }}
    >
      <motion.div variants={item} style={{ color: "#c8c8cc", fontWeight: 600, marginBottom: 6 }}>
        {node.title}
      </motion.div>
      {node.subtitle && (
        <motion.div variants={item} style={{ color: "#7a7a88", marginBottom: 8 }}>
          {node.subtitle}
        </motion.div>
      )}
      {node.body.map((line, i) => (
        <motion.div key={i} variants={item} style={{ color: "#c8c8cc", lineHeight: 1.6 }}>
          {line}
        </motion.div>
      ))}
      {node.tags && node.tags.length > 0 && (
        <motion.div variants={item} style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {node.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "rgba(139,143,168,0.15)",
                border: "1px solid rgba(139,143,168,0.3)",
                borderRadius: 3,
                padding: "1px 6px",
                fontSize: 11,
                color: "#8b8fa8",
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
