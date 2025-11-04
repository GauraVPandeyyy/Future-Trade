import React, { useEffect, useMemo, useState } from 'react';
import { getTeam } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../context/AuthContext';
import './TeamTree.css';

function normalize(data) {
  if (!data) return null;
  const mapNode = (u) => ({
    id: u.user_id,
    name: u.name,
    phone: u.phone || 'N/A',
    email: u.email || 'N/A',
    referral_code: u.referral_code || 'N/A',
    total_investment:u.total_investment || 0,
    Total_Income:u.Total_Income || 0,
    This_Month_Income:u.This_Month_Income || 0,
    children: (u.children || u.downline || []).map(mapNode),
  });
  return mapNode(data);
}

const TeamTree = () => {
  const { user } = useAuthContext();
  const [root, setRoot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.user_id) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await getTeam(user.user_id);
        if (res?.status) {
          setRoot(normalize(res));
        } else {
          toast.error('Failed to load team');
        }
      } catch {
        toast.error('Network error loading team');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user?.user_id]);

  if (loading) {
    return (
      <div className="team-tree-loading">
        <div className="loading-spinner" />
        <p>Loading referral tree…</p>
      </div>
    );
  }
  if (!root) {
    return (
      <div className="team-tree-empty">
        <p>No referral data to display</p>
      </div>
    );
  }

  return (
    <div className="team-tree-container">
      <div className="team-tree">
        <TreeNode node={root} level={0} />
      </div>
    </div>
  );
};

const TreeNode = ({ node, level }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children?.length > 0;

  return (
    <div className={`tree-node level-${level}`}>
      <div className="node-wrap">
        <div className="node-card has-tooltip">
          <div className="node-title">{node.name}</div>
          <div className="node-sub">ID: {node.id}</div>
          {/* <div className="node-sub">Ref: {node.referral_code}</div> */}

          {/* Tooltip */}
          <div className="tooltip tooltip-top">
            <div className="tooltip-inner">
              <div className="tt-name">{node.name}</div>
              <div className="tt-row"><span>ID</span><span>{node.id}</span></div>
              <div className="tt-row"><span>Phone</span><span>{node.phone}</span></div>
              <div className="tt-row"><span>Email</span><span className="tt-ellipsis">{node.email}</span></div>
              <div className="tt-row"><span>Referral</span><span className="tt-ellipsis">{node.referral_code}</span></div>
              <div className="tt-row"><span>Total Investment</span><span className="tt-ellipsis">{node.total_investment}</span></div>
              <div className="tt-row"><span>Total Income</span><span className="tt-ellipsis">{node.Total_Income}</span></div>
              <div className="tt-row"><span>This Month Income</span><span className="tt-ellipsis">{node.This_Month_Income}</span></div>
            </div>
          </div>
        </div>

        {hasChildren && (
          <button
            className={`expand-btn ${expanded ? 'is-open' : ''}`}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>

      {hasChildren && (
        <div className={`children-block ${expanded ? 'open' : 'closed'}`}>
          {/* connector between parent and children row */}
          <div className="vc-line" />
          <div className="children-row">
            {/* Horizontal line auto-centers to children midpoints */}
            <div className={`hc-line ${node.children.length === 1 ? 'single' : ''}`} />
            {node.children.map((child) => (
              <div className="child-slot" key={child.id}>
                {/* child vertical tick from horizontal line to the node */}
                <div className="child-tick" />
                <TreeNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTree;
