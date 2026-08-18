'use client';

import { useState, useEffect } from 'react';
import { DynamicActivity } from '@/types';
import { formatTextWithLinks } from '@/lib/formatTextWithLinks';

interface DynamicActivitiesProps {
  initialActivities?: DynamicActivity[];
}

export default function DynamicActivities({ initialActivities }: DynamicActivitiesProps) {
  const [activities, setActivities] = useState<DynamicActivity[]>(initialActivities || []);
  const [loading, setLoading] = useState(!initialActivities);

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dynamic activities:', err);
        setLoading(false);
      });
  }, [initialActivities]);

  if (loading && (!activities || activities.length === 0)) {
    return null;
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div id="dynamic-sections">
      {activities.map((act) => {
        const hasSubtitle = !!act.subtitle && act.subtitle.trim().length > 0;
        const hasCategory = !!act.category && act.category.trim().length > 0;
        const hasDate = !!act.date && act.date.trim().length > 0;
        const hasTime = !!act.time && act.time.trim().length > 0;
        const hasContent = !!act.content && act.content.trim().length > 0;

        return (
          <section
            key={act.id}
            id={`activity-${act.id}`}
            className="section-padding relative-z"
            style={{
              backgroundColor: 'var(--bg-page)',
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="glass-card p-4 p-md-5 hover-lift position-relative border-accent">
                    {/* Header Row: Category Badge & Date/Time */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      {hasCategory ? (
                        <span className="badge bg-accent text-dark fw-bold px-3 py-2 fs-6 rounded-pill">
                          <i className="fas fa-star me-1"></i> {act.category}
                        </span>
                      ) : (
                        <span />
                      )}

                      <div className="d-flex align-items-center gap-3 text-muted dark:text-gray-300 small fw-bold">
                        {hasDate && (
                          <span>
                            <i className="far fa-calendar-alt text-accent me-1"></i> {act.date}
                          </span>
                        )}
                        {hasTime && (
                          <span>
                            <i className="far fa-clock text-accent me-1"></i> {act.time}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Title */}
                    <h3 className="section-title text-start mb-2 text-primary dark:text-white fw-bold" style={{ textShadow: 'none' }}>
                      {act.title}
                    </h3>

                    {/* Subtitle if present */}
                    {hasSubtitle && (
                      <h5 className="text-accent fw-bold mb-3">
                        {act.subtitle}
                      </h5>
                    )}

                    {/* Divider if there is content */}
                    {hasContent && <hr className="my-3 border-secondary opacity-25" />}

                    {/* Main Content Details with preserved line breaks */}
                    {hasContent && (
                      <div
                        className="text-main dark:text-gray-200 fs-5 mt-3"
                        style={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.9',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {formatTextWithLinks(act.content!)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
