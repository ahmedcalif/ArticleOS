import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Voter {
    id: number;
    user_id: number;
    username: string;
    vote_type: number;
    created_at: string;
}

interface VoterListProps {
    votableId: number;
    votableType: string;
    upvotesCount: number;
    downvotesCount: number;
}

const VoterList = ({ votableId, votableType, upvotesCount, downvotesCount }: VoterListProps) => {
    const [voters, setVoters] = useState<Voter[]>([]);
    const [upvoters, setUpvoters] = useState<Voter[]>([]);
    const [downvoters, setDownvoters] = useState<Voter[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchVoters = async () => {
        if (!isOpen) return;

        setIsLoading(true);
        setError(null);

        try {
            // Fix: ensure we're using the exact parameter names expected by the backend
            // and properly encoding the votable_type
            const params = new URLSearchParams({
                votable_id: votableId.toString(),
                votable_type: votableType,
            });

            console.log('Requesting voters with params:', Object.fromEntries(params.entries()));

            const response = await axios.get(`/voters?${params.toString()}`);

            console.log('Voters response:', response.data);

            if (response.data.voters) {
                setVoters(response.data.voters);
                setUpvoters(response.data.voters.filter((voter: Voter) => voter.vote_type === 1));
                setDownvoters(response.data.voters.filter((voter: Voter) => voter.vote_type === -1));
            } else {
                setVoters([]);
                setUpvoters([]);
                setDownvoters([]);
                console.warn('No voters data in response:', response.data);
            }
        } catch (err) {
            console.error('Error fetching voters:', err);
            setError('Failed to load voters. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchVoters();
        }
    }, [isOpen, votableId, votableType]);

    // Format the timestamp
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const totalVotes = upvotesCount + downvotesCount;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    <Users className="mr-1 h-4 w-4" />
                    {totalVotes > 0 && (
                        <span>
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Who voted on this post</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All ({voters.length})</TabsTrigger>
                        <TabsTrigger value="upvotes">
                            <ThumbsUp className="mr-1 h-3 w-3" />
                            Upvotes ({upvoters.length})
                        </TabsTrigger>
                        <TabsTrigger value="downvotes">
                            <ThumbsDown className="mr-1 h-3 w-3" />
                            Downvotes ({downvoters.length})
                        </TabsTrigger>
                    </TabsList>

                    {isLoading ? (
                        <div className="py-4 text-center">Loading voters...</div>
                    ) : error ? (
                        <div className="py-4 text-center text-red-500">{error}</div>
                    ) : (
                        <>
                            <TabsContent value="all" className="max-h-96 overflow-y-auto">
                                {voters.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {voters.map((voter) => (
                                            <li key={voter.id} className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Avatar className="mr-2 h-8 w-8">
                                                        <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                            {voter.username.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{voter.username}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {voter.vote_type === 1 ? (
                                                        <ThumbsUp className="h-4 w-4 text-blue-500" />
                                                    ) : (
                                                        <ThumbsDown className="h-4 w-4 text-red-500" />
                                                    )}
                                                    <span className="ml-2 text-xs text-gray-500">{formatDate(voter.created_at)}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-4 text-center">No votes yet</div>
                                )}
                            </TabsContent>

                            <TabsContent value="upvotes" className="max-h-96 overflow-y-auto">
                                {upvoters.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {upvoters.map((voter) => (
                                            <li key={voter.id} className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Avatar className="mr-2 h-8 w-8">
                                                        <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                            {voter.username.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{voter.username}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(voter.created_at)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-4 text-center">No upvotes yet</div>
                                )}
                            </TabsContent>

                            <TabsContent value="downvotes" className="max-h-96 overflow-y-auto">
                                {downvoters.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {downvoters.map((voter) => (
                                            <li key={voter.id} className="flex items-center justify-between py-2">
                                                <div className="flex items-center">
                                                    <Avatar className="mr-2 h-8 w-8">
                                                        <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                            {voter.username.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{voter.username}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{formatDate(voter.created_at)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-4 text-center">No downvotes yet</div>
                                )}
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default VoterList;
