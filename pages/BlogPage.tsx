import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const postsPerPage = 9;

  const posts = [
    {
      title: '5 Common Denial Reasons and How to Fix Them',
      category: 'Denials',
      date: 'November 20, 2025',
      excerpt: 'Learn the most common reasons claims get denied and the exact steps to resolve them quickly. This guide covers coding errors, timely filing issues, and more.',
      readTime: '5 min read',
      url: 'https://wonderws.com/5-most-common-dme-claim-denials-and-how-to-fix-them/'
    },
    {
      title: 'How to Clean Up AR in 30 Days',
      category: 'AR Management',
      date: 'November 15, 2025',
      excerpt: 'A step-by-step action plan to tackle aging accounts receivable and get your practice back on track. Includes templates and prioritization strategies.',
      readTime: '8 min read',
      url: 'https://www.billtrust.com/resources/blog/days-in-ar-in-medical-billing'
    },
    {
      title: 'CPT vs ICD-10: Understanding the Difference',
      category: 'Coding Tips',
      date: 'November 10, 2025',
      excerpt: 'Confused about medical coding? This beginner-friendly guide breaks down the basics in plain language and explains when to use each code type.',
      readTime: '6 min read',
      url: 'https://www.northwestcareercollege.edu/blog/guide-for-medical-billers-coders-on-icd-10-codes-versus-cpt-codes/'
    },
    {
      title: 'What to Include in Your Medical Billing Resume',
      category: 'Career Advice',
      date: 'November 5, 2025',
      excerpt: 'Stand out from the competition with a resume that highlights your billing skills effectively. Tips for new billers and experienced professionals.',
      readTime: '7 min read',
      url: 'https://resume.io/resume-examples/medical-biller'
    },
    {
      title: 'Understanding Medicare Modifiers: A Quick Reference',
      category: 'Coding Tips',
      date: 'October 28, 2025',
      excerpt: 'Modifiers can be confusing, but they\'re critical for getting paid correctly. This reference guide covers the most commonly used Medicare modifiers.',
      readTime: '10 min read',
      url: 'https://hmsgroupinc.com/medicare-modifiers-in-medical-billing/'
    },
    {
      title: 'How to Handle Patient Payment Conversations',
      category: 'Communication',
      date: 'October 22, 2025',
      excerpt: 'Talking about money is never easy, but it\'s part of the job. Learn how to have compassionate, clear conversations about patient balances.',
      readTime: '5 min read',
      url: 'https://healthcaretoday.com/article/navigating-patient-payment-conversations-with-confidence'
    },
    {
      title: 'Top 10 Medical Billing Certifications in 2025',
      category: 'Career Advice',
      date: 'October 15, 2025',
      excerpt: 'Which certification is right for you? Compare the top billing and coding certifications including CPB, CPC, and specialty certifications.',
      readTime: '9 min read',
      url: 'https://dumpsgate.com/best-medical-coding-certification/'
    },
    {
      title: 'Creating an Efficient Denial Management Workflow',
      category: 'AR Management',
      date: 'October 8, 2025',
      excerpt: 'Stop letting denials pile up. Implement a systematic workflow that ensures every denial gets reviewed, resolved, or appealed promptly.',
      readTime: '7 min read',
      url: 'https://akasa.com/blog/work-medical-billing-denials-more-effectively/'
    },
    {
      title: 'HIPAA Compliance for Medical Billers: What You Need to Know',
      category: 'Compliance',
      date: 'October 1, 2025',
      excerpt: 'Protect patient privacy and avoid costly violations. This guide covers essential HIPAA requirements every biller should understand.',
      readTime: '8 min read',
      url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/index.html'
    },
  ];

  const categories = ['All', 'AR Management', 'Coding Tips', 'Denials', 'Career Advice', 'Compliance', 'Communication'];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredCurrentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const filteredTotalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-gray-900 mb-4 md:mb-6">Billing Insights You Can Actually Use</h1>
          <p className="text-gray-600">
            Practical tips, real-world advice, and industry updates to help you stay sharp and successful in medical billing. No jargon overload—just clear, actionable content you can apply immediately.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === selectedCategory ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCurrentPosts.map((post, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0" asChild>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      Read More →
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: filteredTotalPages }, (_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? 'default' : 'outline'}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === filteredTotalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6">Never Miss a Post</h2>
          <p className="text-blue-100 mb-8">
            Get new blog posts, billing tips, and exclusive resources delivered straight to your inbox every week.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-gray-900"
            />
            <Button variant="secondary" type="submit">
              Subscribe
            </Button>
          </form>
          <p className="text-blue-100 mt-4">
            Free to join. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}