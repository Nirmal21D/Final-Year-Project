"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";


const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      router.push('/blogs');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData?.role === 'admin') {
        setIsAdmin(true);
        fetchBlogs();
      } else {
        router.push('/blogs');
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      router.push('/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, "blogs");
      const q = query(blogsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      try {
        const blogRef = doc(db, "blogs", id);
        await deleteDoc(blogRef);
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
       <div className="w-[250px] max-lg:w-[150px] max-md:w-[80px] max-sm:w-[0px]">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <div className="text-sm text-gray-500">
            Total Blogs: {blogs.length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.coverImage && (
                        <div className="relative h-16 w-16">
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {blog.authorName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {blog.createdAt?.toDate().toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBlog(blog)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blog Preview Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                {selectedBlog.coverImage && (
                  <div className="relative h-64 mb-4">
                    <Image
                      src={selectedBlog.coverImage}
                      alt={selectedBlog.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  <p>Author: {selectedBlog.authorName}</p>
                  <p>Published: {selectedBlog.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};
export default AdminBlogsPage;