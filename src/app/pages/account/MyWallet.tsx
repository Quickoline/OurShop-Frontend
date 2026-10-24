import { useEffect, useState } from 'react';
import { Copy, IndianRupee, Users, Wallet, GitBranch, User, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { walletApi, unwrapApiData } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { shop } from '../../config/shop';

const formatMoney = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
    Number(n || 0)
  );

type TeamMember = {
  _id: string;
  name: string;
  email?: string;
  referralCode?: string;
  referredBy?: { _id?: string; name?: string; referralCode?: string };
};

const memberKey = (m: { _id?: string; id?: string }) =>
  String(m._id ?? m.id ?? `${m}`);

type TreeNode = {
  member: TeamMember;
  children?: TreeNode[];
};

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
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground">{m.name}</p>
            {m.email && <p className="text-xs text-muted-foreground">{m.email}</p>}
            {m.referredBy?.name && !isRoot && (
              <p className="text-xs text-primary/90 mt-0.5">
                Referred by <strong>{m.referredBy.name}</strong>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [wRes, tRes, teamRes] = await Promise.all([
          walletApi.getMyWallet(),
          walletApi.getMyTransactions(1, 30),
          walletApi.getMyTeam(),
        ]);
        setWallet(unwrapApiData<any>(wRes));
        const txData = unwrapApiData<any>(tRes);
        setTransactions(txData?.transactions ?? (Array.isArray(txData) ? txData : []));
        setTeam(unwrapApiData<any>(teamRes));
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

  const canRefer = wallet?.canRefer !== false;
  const referralCode = canRefer ? wallet?.referralCode || user?.referralCode : null;
  const shareLink =
    typeof window !== 'undefined' && referralCode
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : '';

  const copyReferral = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(shareLink || referralCode);
    toast.success('Referral link copied');
  };

  const shareReferral = async () => {
    if (!shareLink || !referralCode) return;

    const shareData = {
      title: `Join ${shop.name}`,
      text: `Join ${shop.name} with my referral code ${referralCode}`,
      url: shareLink,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    copyReferral();
  };

  const directCount = team?.directCount ?? team?.directReferrals?.length ?? 0;
  const indirectCount = team?.indirectCount ?? team?.indirectReferrals?.length ?? 0;
  const totalTeam = team?.totalTeamCount ?? directCount + indirectCount;
  const tree: TreeNode | null = team?.tree ?? null;

  if (loading) {
    return <p className="text-muted-foreground py-8">Loading wallet...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your balance, referrals, and transaction history.
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
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Indirect referrals</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{indirectCount}</p>
        </div>

        <div
          id="refer"
          className="bg-white rounded-2xl border border-border p-6 shadow-sm scroll-mt-24 sm:col-span-2 lg:col-span-1"
        >
          {canRefer ? (
            <>
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
                <button
                  type="button"
                  onClick={shareReferral}
                  className="p-2 rounded-lg border border-border hover:bg-secondary text-primary"
                  aria-label="Share referral link"
                >
                  <Share2 size={18} />
                </button>
              </div>
              {shareLink && (
                <p className="mt-2 text-xs text-muted-foreground break-all">{shareLink}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Referral sharing is not available.</p>
          )}
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
          Total team: <strong>{totalTeam}</strong> ({directCount} direct, {indirectCount} indirect)
        </p>

        {tree ? (
          <>
            <ul className="space-y-2">
              <TeamTreeNode node={tree} isRoot />
            </ul>
            {totalTeam === 0 && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                No referrals yet — share your code to invite others.
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <Users className="mx-auto text-muted-foreground mb-3" size={32} />
            <p className="font-medium text-foreground">No referrals yet</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Share your referral link to grow your team.
            </p>
            {referralCode && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={shareReferral}
                  className="btn-primary text-sm !py-2 !px-4 inline-flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share referral link
                </button>
                <button
                  type="button"
                  onClick={copyReferral}
                  className="text-sm !py-2 !px-4 inline-flex items-center gap-2 rounded-xl border border-border font-semibold hover:bg-secondary"
                >
                  <Copy size={16} />
                  Copy link
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
                  {tx.createdAt && (
                    <p className="text-muted-foreground text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  )}
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
