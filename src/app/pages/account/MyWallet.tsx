import { useEffect, useState } from 'react';
import { Copy, IndianRupee, Users, Wallet, GitBranch, User } from 'lucide-react';
import { toast } from 'sonner';
import { walletApi, unwrapApiData } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const formatMoney = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
    Number(n || 0)
  );

const levelLabels: Record<string, string> = {
  head: 'Head (buyer)',
  level1: 'Level 1 (upline)',
  level2: 'Level 2 (upline)',
  level3: 'Level 3',
  level4: 'Level 4',
  level5: 'Level 5',
  level6: 'Level 6',
};

type TeamMember = {
  _id: string;
  name: string;
  email?: string;
  referralCode?: string;
  level?: number;
  type?: string;
  label?: string;
  shortLabel?: string;
  commissionNote?: string;
  createdAt?: string;
  referredBy?: { _id?: string; name?: string; referralCode?: string };
};

const memberKey = (m: { _id?: string; id?: string }) =>
  String(m._id ?? m.id ?? `${m}`);

type TreeNode = {
  level: number;
  type: string;
  label: string;
  shortLabel?: string;
  commissionNote?: string;
  member: TeamMember;
  children?: TreeNode[];
};

function levelBadgeClass(type: string) {
  if (type === 'you') return 'bg-foreground text-background';
  if (type === 'direct') return 'bg-primary text-primary-foreground';
  return 'bg-secondary text-foreground border border-border';
}

function TeamTreeNode({ node, isRoot = false }: { node: TreeNode; isRoot?: boolean }) {
  const m = node.member;
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <li className="list-none">
      <div
        className={`relative rounded-xl border p-4 ${
          isRoot ? 'border-primary/40 bg-primary/5' : 'border-border bg-white'
        }`}
      >
        <div className="flex flex-wrap items-start gap-2 gap-y-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${levelBadgeClass(node.type)}`}
          >
            {node.shortLabel || node.label}
          </span>
          {!isRoot && node.label && node.type !== 'you' && (
            <span className="text-[11px] text-muted-foreground w-full sm:w-auto">{node.label}</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground">{m.name}</p>
            {m.email && <p className="text-xs text-muted-foreground">{m.email}</p>}
            {m.referredBy?.name && !isRoot && (
              <p className="text-xs text-primary/90 mt-0.5">
                Joined via <strong>{m.referredBy.name}</strong>
                {m.referredBy.referralCode ? ` (${m.referredBy.referralCode})` : ''}
              </p>
            )}
          </div>
          {m.referralCode && (
            <code className="text-xs font-bold text-primary bg-secondary px-2 py-1 rounded-md">
              {m.referralCode}
            </code>
          )}
        </div>
        {node.commissionNote && (
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{node.commissionNote}</p>
        )}
      </div>

      {hasChildren && (
        <ul className="mt-2 ml-3 sm:ml-5 pl-4 sm:pl-6 border-l-2 border-primary/25 space-y-2">
          {node.children!.map((child) => (
            <TeamTreeNode key={memberKey(child.member)} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function MyWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [team, setTeam] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [wRes, tRes, teamRes, cfgRes] = await Promise.all([
          walletApi.getMyWallet(),
          walletApi.getMyTransactions(1, 30),
          walletApi.getMyTeam(),
          walletApi.getConfig(),
        ]);
        const walletData = unwrapApiData<any>(wRes);
        const txData = unwrapApiData<any>(tRes);
        const teamData = unwrapApiData<any>(teamRes);
        const configData = unwrapApiData<any>(cfgRes);

        if (import.meta.env.DEV) {
          console.info('[MyWallet] team API', {
            directCount: teamData?.directCount,
            indirectCount: teamData?.indirectCount,
            hasTree: Boolean(teamData?.tree),
            level2: teamData?.membersByLevel?.find((l: any) => l.level === 2)?.members?.map(
              (m: any) => m.email
            ),
            priyaChild: teamData?.tree?.children?.find(
              (c: any) => c.member?.referralCode === 'PRIYA01'
            )?.children?.map((c: any) => c.member?.email),
          });
        }

        setWallet(walletData);
        setTransactions(txData?.transactions ?? (Array.isArray(txData) ? txData : []));
        setTeam(teamData);
        setConfig(configData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading && window.location.hash === '#refer') {
      document.getElementById('refer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const referralCode = wallet?.referralCode || user?.referralCode;
  const shareLink =
    typeof window !== 'undefined' && referralCode
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : '';

  const copyReferral = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(shareLink || referralCode);
    toast.success('Referral link copied');
  };

  const directCount = team?.directCount ?? team?.directReferrals?.length ?? 0;
  const indirectCount = team?.indirectCount ?? team?.indirectReferrals?.length ?? 0;
  const totalTeam = team?.totalTeamCount ?? directCount + indirectCount;
  const tree: TreeNode | null = team?.tree ?? null;
  const indirectMembers: TeamMember[] =
    team?.indirectReferrals ??
    team?.membersByLevel
      ?.filter((l: { level: number }) => l.level > 1)
      ?.flatMap((l: { members: TeamMember[] }) => l.members) ??
    [];
  const membersByLevel: Array<{
    level: number;
    type: string;
    label: string;
    shortLabel: string;
    commissionNote: string;
    count: number;
    members: TeamMember[];
  }> = team?.membersByLevel ?? [];

  if (loading) {
    return <p className="text-muted-foreground py-8">Loading wallet...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Commissions are <strong>upline only</strong> — never paid to downline. You earn when someone
          you <strong>referred</strong> orders (Level 1 sponsor). If Rahul buys, only Rahul gets Head;
          the other 90% of the network pool (Levels 1–6) goes to the <strong>company wallet</strong> —
          not Priya, Virat, or anyone in his downline.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Wallet size={20} />
            <span className="text-sm font-medium">Balance</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {formatMoney(wallet?.walletBalance ?? 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <User size={20} />
            <span className="text-sm font-medium">Direct referrals</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{directCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Level 1 · joined with your code</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Indirect referrals</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{indirectCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Level 2+ · under your direct team</p>
        </div>

        <div
          id="refer"
          className="bg-white rounded-2xl border border-border p-6 shadow-sm scroll-mt-24"
        >
          <p className="text-sm font-medium text-foreground mb-2">Your referral code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-secondary px-3 py-2 rounded-lg font-bold text-primary text-sm">
              {referralCode || '—'}
            </code>
            <button
              type="button"
              onClick={copyReferral}
              className="p-2 rounded-lg border border-border hover:bg-secondary"
              aria-label="Copy referral link"
            >
              <Copy size={18} />
            </button>
          </div>
          {wallet?.sponsor && (
            <p className="text-xs text-muted-foreground mt-3">
              Your sponsor: {wallet.sponsor.name} ({wallet.sponsor.referralCode})
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch size={20} className="text-primary" />
          <h2 className="font-bold text-foreground text-lg">Referral tree</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Total team under you: <strong>{totalTeam}</strong> ({directCount} direct + {indirectCount}{' '}
          indirect). Tree shows who referred whom; labels are <strong>team levels</strong> (not order
          Head/Level payouts).
        </p>

        {membersByLevel.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {membersByLevel.map((row) => (
              <span
                key={row.level}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  row.type === 'direct'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-secondary text-foreground'
                }`}
              >
                {row.shortLabel}: {row.count}
              </span>
            ))}
          </div>
        )}

        {indirectMembers.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">
              Indirect referrals (under your direct team)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              These people used your team member&apos;s code — nested under them in the tree. You earn
              upline Level 2+ only when <strong>they</strong> place an order (not when their sponsor
              orders).
            </p>
            <ul className="space-y-2">
              {indirectMembers.map((m) => (
                <li
                  key={memberKey(m)}
                  className="flex flex-wrap justify-between gap-2 text-sm bg-white rounded-lg border border-amber-100 px-4 py-3"
                >
                  <div>
                    <span className="font-semibold text-foreground">{m.name}</span>
                    {m.email && (
                      <span className="text-muted-foreground"> · {m.email}</span>
                    )}
                    {m.referredBy?.name && (
                      <p className="text-xs text-primary mt-0.5">
                        Under {m.referredBy.name} · {m.shortLabel || m.label}
                      </p>
                    )}
                  </div>
                  <code className="text-xs font-bold text-primary">{m.referralCode}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tree ? (
          <>
            <ul className="space-y-2">
              <TeamTreeNode node={tree} isRoot />
            </ul>
            {totalTeam === 0 && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                No direct or indirect referrals yet — share your code to grow this tree.
              </p>
            )}
          </>
        ) : membersByLevel.length > 0 || (team?.directReferrals?.length ?? 0) > 0 ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            Tree view is loading outdated data — use the level lists below. Refresh the page or
            restart the backend server.
          </p>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <Users className="mx-auto text-muted-foreground mb-3" size={32} />
            <p className="font-medium text-foreground">No referrals in your tree yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Share your code so others sign up as <strong>Level 1 — Direct</strong>. Their referrals
              appear under them as <strong>Level 2 — Indirect</strong>, and so on.
            </p>
            {referralCode && (
              <button
                type="button"
                onClick={copyReferral}
                className="mt-4 btn-primary text-sm !py-2 !px-4"
              >
                Copy referral link
              </button>
            )}
          </div>
        )}

        {membersByLevel.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-foreground text-sm mb-4">By level (flat view)</h3>
            <div className="space-y-6">
              {membersByLevel.map((row) => (
                <div key={row.level}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${levelBadgeClass(row.type)}`}
                    >
                      {row.shortLabel}
                    </span>
                    <span className="text-sm font-medium text-foreground">{row.label}</span>
                    <span className="text-xs text-muted-foreground">({row.count})</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{row.commissionNote}</p>
                  <ul className="space-y-2">
                    {row.members.map((m) => (
                      <li
                        key={memberKey(m)}
                        className="flex flex-wrap justify-between items-center gap-2 text-sm border border-border rounded-lg px-4 py-3 bg-secondary/30"
                      >
                        <span>
                          <span className="font-medium text-foreground">{m.name}</span>
                          {m.email && (
                            <span className="text-muted-foreground"> · {m.email}</span>
                          )}
                          {m.referredBy?.name && row.level > 1 && (
                            <span className="block text-xs text-primary mt-0.5">
                              Under {m.referredBy.name}
                            </span>
                          )}
                        </span>
                        <code className="text-xs font-bold text-primary">{m.referralCode}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {config?.levelRates && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-3">Commission plan (on orders)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            On each delivered order: profit is split {config.adminSharePercent}% company /{' '}
            {config.mlmSharePercent}% network. <strong>Head</strong> = buyer (10% of network pool).{' '}
            <strong>Levels 1–6</strong> = sponsor upline only; empty slots go to the company wallet.
            Downline never earns on the buyer&apos;s order. Pool split:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            {Object.entries(config.levelRates).map(([key, pct]) => (
              <div key={key} className="bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-muted-foreground">{levelLabels[key] || key}</span>
                <span className="block font-bold text-foreground">{String(pct)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <IndianRupee size={18} className="text-primary" />
          <h2 className="font-bold text-foreground">Transaction history</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-6 text-muted-foreground text-sm">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx: any) => (
              <li key={tx._id} className="px-6 py-4 flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{tx.description || tx.type}</p>
                  <p className="text-muted-foreground text-xs">
                    {tx.mlmLevel ? levelLabels[tx.mlmLevel] || tx.mlmLevel : tx.type}
                    {tx.createdAt && ` · ${new Date(tx.createdAt).toLocaleString()}`}
                  </p>
                </div>
                <span
                  className={`font-bold whitespace-nowrap ${
                    Number(tx.amount) >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {Number(tx.amount) >= 0 ? '+' : ''}
                  {formatMoney(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
