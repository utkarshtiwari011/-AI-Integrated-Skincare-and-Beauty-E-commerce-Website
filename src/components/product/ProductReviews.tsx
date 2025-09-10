import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, ThumbsUp, Verified, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user?: {
    full_name?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    breakdown: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          rating,
          title,
          comment,
          created_at
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) {
      setStats({ average: 0, total: 0, breakdown: [0, 0, 0, 0, 0] });
      return;
    }

    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const breakdown = [0, 0, 0, 0, 0];
    reviewsData.forEach(review => {
      breakdown[review.rating - 1]++;
    });

    setStats({ average, total, breakdown });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="border-primary/10 shadow-elevated">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/10 shadow-elevated">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-8">
          {/* Review Summary */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-primary">{stats.average.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(stats.average)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on {stats.total} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress 
                    value={stats.total > 0 ? (stats.breakdown[rating - 1] / stats.total) * 100 : 0} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.breakdown[rating - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            <h4 className="font-semibold text-xl">Customer Reviews</h4>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-medium text-primary">
                        <User className="h-5 w-5" />
                      </div>

                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">Anonymous User</span>
                            <Badge variant="outline" className="text-xs">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.rating}/5</span>
                        </div>

                        {/* Title */}
                        {review.title && (
                          <h5 className="font-semibold">{review.title}</h5>
                        )}

                        {/* Comment */}
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {reviews.length >= 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      Load More Reviews
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;