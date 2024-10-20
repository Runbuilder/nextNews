import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight, Search, PenSquare, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const postsPerPage = 5;
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles:author_id(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  };

  const incrementViews = async (postId, currentViews) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({ views: currentViews + 1 })
        .eq('id', postId)
        .select();

      if (error) throw error;

      // 업데이트된 게시물로 posts 상태 업데이트
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId ? { ...post, views: currentViews + 1 } : post
      ));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const deletePost = async (postId) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      alert('게시물 삭제에 실패했습니다.');
    } else {
      fetchPosts(); // Refresh posts after deletion
      setSelectedPost(null);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePostClick = async (post) => {
    await incrementViews(post.id, post.views);
    setSelectedPost({ ...post, views: post.views + 1 });
  };

  const handleWriteClick = () => {
    setShowWriteForm(true);
  };

  const handleCancelWrite = () => {
    setShowWriteForm(false);
    setNewPost({ title: "", content: "" });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          title: newPost.title, 
          content: newPost.content,
          author_id: user.id,
          views: 0,
          comments: 0
        }
      ]);

    if (error) {
      console.error('Error inserting new post:', error);
      alert('게시물 작성에 실패했습니다: ' + error.message);
    } else {
      console.log('New post added:', data);
      fetchPosts(); // Refresh the posts list
      setShowWriteForm(false);
      setNewPost({ title: "", content: "" });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-2xl font-bold">커뮤니티 게시판</CardTitle>
          {user && !showWriteForm && !selectedPost && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleWriteClick}>
              <PenSquare className="mr-2 h-4 w-4" />
              글쓰기
            </Button>
          )}
        </div>
        {!showWriteForm && !selectedPost && (
          <div className="relative">
            <Input
              type="search"
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {showWriteForm ? (
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <Label htmlFor="post-title">제목</Label>
              <Input
                id="post-title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="게시글 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <Label htmlFor="post-content">내용</Label>
              <Textarea
                id="post-content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="게시글 내용을 입력하세요"
                required
                rows={5}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancelWrite}>취소</Button>
              <Button type="submit">게시하기</Button>
            </div>
          </form>
        ) : selectedPost ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Avatar className="mr-2">
                  <AvatarImage src={selectedPost.profiles?.avatar_url} />
                  {/* <AvatarFallback>{selectedPost.profiles?.full_name?.[0] || 'U'}</AvatarFallback> */}
                </Avatar>
                <h3 className="text-xl font-bold">{selectedPost.title}</h3>
              </div>
              {user && user.id === selectedPost.author_id && (
                <Button variant="destructive" onClick={() => deletePost(selectedPost.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              )}
            </div>
            <p>{selectedPost.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              <span>조회수: {selectedPost.views}</span>
            </div>
            <Button onClick={() => setSelectedPost(null)} className="mt-4">목록으로 돌아가기</Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {currentPosts.map((post) => (
              <li key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          <AvatarImage src={post.profiles?.avatar_url} />
                          {/* <AvatarFallback>{post.profiles?.full_name?.[0] || 'U'}</AvatarFallback> */}
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>조회수: {post.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {!showWriteForm && !selectedPost && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">이전 페이지</span>
          </Button>
          <div className="text-sm text-gray-500">
            페이지 {currentPage} / {Math.ceil(filteredPosts.length / postsPerPage)}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">다음 페이지</span>
          </Button>
        </CardFooter>
      )}
      {!user && <p className="text-center mt-4">게시물을 작성하려면 로그인이 필요합니다.</p>}
    </Card>
  );
};

export default PostsPage;
