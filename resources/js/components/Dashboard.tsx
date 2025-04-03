import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';

interface RedditCardProps {
    title: string;
    username: string;
    subreddit: string;
    timePosted: string;
    content: string;
    votes: number;
    commentCount: number;
    userAvatar?: string;
}

export const RedditCard: React.FC<RedditCardProps> = ({ title, username, subreddit, timePosted, content, votes, commentCount, userAvatar }) => {
    return (
        <Card className="w-full max-w-2xl cursor-pointer transition-colors hover:border-gray-400">
            <div className="flex">
                <div className="flex w-10 flex-col items-center rounded-l-lg bg-gray-50 py-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{votes}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1">
                    <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Avatar className="h-5 w-5">
                                {userAvatar ? <AvatarImage src={userAvatar} alt={subreddit} /> : <AvatarFallback>r/</AvatarFallback>}
                            </Avatar>
                            <span className="font-medium">r/{subreddit}</span>
                            <span>•</span>
                            <span>Posted by u/{username}</span>
                            <span>•</span>
                            <span>{timePosted}</span>
                        </div>
                        <h3 className="pt-1 text-lg font-medium">{title}</h3>
                    </CardHeader>

                    <CardContent className="pb-2">
                        <p className="text-sm text-gray-700">{content}</p>
                    </CardContent>

                    <CardFooter className="border-t border-gray-100 pt-2 pb-2">
                        <div className="flex items-center space-x-4 text-gray-500">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                <MessageSquare className="h-4 w-4" />
                                <span>{commentCount} Comments</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                                <Bookmark className="h-4 w-4" />
                                <span>Save</span>
                            </Button>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
};

export function DashboardComponent() {
    return (
        <div className="space-y-4 p-4">
            <RedditCard
                title="Just watched Dune: Part Two and was blown away!"
                username="scifi_enthusiast"
                subreddit="movies"
                timePosted="5 hours ago"
                content="The cinematography and sound design were incredible. Denis Villeneuve really outdid himself with this sequel. The character development was also much stronger than in Part One. What did you all think about it?"
                votes={842}
                commentCount={156}
            />

            <RedditCard
                title="TIL that honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat."
                username="history_buff"
                subreddit="todayilearned"
                timePosted="7 hours ago"
                content="The unique chemical composition of honey, including its low moisture content and acidic pH, creates an environment where bacteria cannot survive. Honey is also naturally antimicrobial, further preventing spoilage."
                votes={1432}
                commentCount={237}
            />
        </div>
    );
}
