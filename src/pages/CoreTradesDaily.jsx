import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar, User, X, Loader2 } from "lucide-react"; // Added Loader2
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function CoreTradesDaily() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.list('-publishedAt');
      // Ensure 'publishedAt' exists and filter for 'published' status
      return posts.filter(post => post.status === 'published' && post.publishedAt);
    },
  });

  useEffect(() => {
    document.title = 'CoreTrades Daily™ - ICI Trades Industry News & Insights | CoreTrades';
    
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setMetaTag('description', 'Stay informed with CoreTrades Daily™ - insights, news, and best practices for North America\'s ICI trades sector. Industry analysis, hiring trends, and expert perspectives.');
    setMetaTag('keywords', 'ICI trades news, construction industry insights, trades hiring trends, industrial construction news, commercial trades articles, skilled trades blog, CoreTrades Daily');
    
    setMetaTag('og:title', 'CoreTrades Daily™ - ICI Trades Industry News & Insights', true);
    setMetaTag('og:description', 'Insights and industry news for North America\'s trades sector. Stay ahead with expert analysis.', true);
    setMetaTag('og:url', 'https://coretrades.co/coretrades-daily', true);
    setMetaTag('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg', true);
    
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', 'CoreTrades Daily™ - ICI Trades Industry News & Insights');
    setMetaTag('twitter:description', 'Industry insights and expert perspectives for ICI trades professionals.');
    setMetaTag('twitter:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg');

    return () => {
      document.title = 'Core Trades Inc.';
    };
  }, []);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <div className="relative min-h-screen">
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e94290f81cfefa873a4024/b784e5965_coretrades4.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "50% 45%",
            backgroundAttachment: "fixed",
          }}
        />
        
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/20 to-black/10" />

        <section className="relative z-[2] min-h-[78vh] md:min-h-[68vh] flex items-center justify-center">
          <div className="text-center max-w-7xl mx-auto px-6 py-20">
            <Newspaper className="w-24 h-24 text-[#f57c00] mx-auto mb-8" />
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
              CoreTrades Daily™
            </h1>
            <p className="text-xl md:text-2xl text-zinc-200 mb-12 max-w-3xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
              Insights and industry news for North America's trades sector.
            </p>
          </div>
        </section>

        <section className="relative z-[2] py-20 bg-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#f57c00] mx-auto mb-4 animate-spin" />
                <p className="text-gray-400 text-lg">Loading articles...</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {blogs.map((article) => (
                    <div
                      key={article.id}
                      className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-[#f57c00] transition-all duration-300 group"
                    >
                      {article.heroImg && (
                        <div
                          className="h-64 bg-cover bg-center"
                          style={{ backgroundImage: `url(${article.heroImg})` }}
                        />
                      )}
                      <div className="p-8">
                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt)}</span> {/* Changed to publishedAt */}
                          </div>
                        </div>

                        {article.categories && article.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.categories.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="border-[#f57c00]/30 text-[#f57c00]">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <h3 className="text-2xl font-bold mb-3 group-hover:text-[#f57c00] transition-colors text-white">
                          {article.title}
                        </h3>
                        <p className="text-gray-200 mb-6 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <Button
                          onClick={() => handleReadMore(article)}
                          className="bg-[#f57c00] hover:bg-[#e65100] text-white"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {blogs.length === 0 && (
                  <div className="text-center py-12">
                    <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No articles published yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Article Detail Modal */}
      <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
        <DialogContent className="bg-[#0a0a0a] border-[#424242] text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedArticle && (
            <>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-3xl font-black text-white mb-4 pr-8">
                  {selectedArticle.title}
                </DialogTitle>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedArticle.publishedAt)}</span> {/* Changed to publishedAt */}
                  </div>
                </div>
                {selectedArticle.categories && selectedArticle.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedArticle.categories.map((cat, idx) => (
                      <Badge key={idx} className="bg-[#f57c00]/20 text-[#f57c00]">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                )}
              </DialogHeader>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto mt-6 pr-2">
                {selectedArticle.heroImg && (
                  <img 
                    src={selectedArticle.heroImg} 
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="text-gray-300 leading-relaxed quill-content">
                    <div dangerouslySetInnerHTML={{ __html: selectedArticle.body }} /> {/* Render HTML from Quill */}
                  </div>
                </div>
              </div>

              {/* Footer with share/close actions */}
              <div className="flex-shrink-0 pt-6 border-t border-[#424242] mt-6">
                <Button
                  onClick={() => setShowArticleModal(false)}
                  className="w-full bg-[#424242] hover:bg-[#616161] text-white"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}