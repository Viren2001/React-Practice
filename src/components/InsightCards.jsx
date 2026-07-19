import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, TrendingUp as TrendingUpIcon } from 'lucide-react';

const InsightCards = ({ insights }) => {
    if (!insights || insights.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle size={18} />;
            case 'success': return <TrendingDown size={18} />; // Usually down is good for spending
            case 'info': return <Lightbulb size={18} />;
            default: return <Lightbulb size={18} />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'warning': return 'var(--warning)';
            case 'success': return 'var(--success)';
            case 'info': return 'var(--primary)';
            default: return 'var(--primary)';
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'warning': return 'rgba(245, 158, 11, 0.1)';
            case 'success': return 'rgba(16, 185, 129, 0.1)';
            case 'info': return 'rgba(var(--primary-rgb), 0.1)';
            default: return 'rgba(var(--primary-rgb), 0.1)';
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <AnimatePresence>
                {insights.map((insight, index) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        style={{
                            background: "rgba(var(--bg-card-rgb), 0.6)",
                            border: `1px solid ${getColor(insight.type)}`,
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start'
                        }}
                        className="glass-effect"
                    >
                        <div style={{
                            background: getBgColor(insight.type),
                            color: getColor(insight.type),
                            padding: '10px',
                            borderRadius: '12px',
                            flexShrink: 0
                        }}>
                            {getIcon(insight.type)}
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: "var(--text-main)" }}>
                                {insight.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: "var(--text-muted)", lineHeight: '1.4' }}>
                                {insight.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default InsightCards;
