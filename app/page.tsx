"use client";

import { Card } from "@/components/ui/card";
import { Upload, FileText, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getUserDocuments, uploadDocument, type Document } from "@/lib/documents";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (!user) return;
      
      setUploading(true);
      try {
        for (const file of acceptedFiles) {
          await uploadDocument(file, user.uid);
          toast.success(`Uploaded ${file.name}`);
        }
        loadDocuments();
      } catch (error) {
        toast.error("Failed to upload document");
      } finally {
        setUploading(false);
      }
    }
  });

  const loadDocuments = async () => {
    if (!user) return;
    const docs = await getUserDocuments(user.uid);
    setDocuments(docs);
    
    const totalSize = docs.reduce((acc, doc) => acc + doc.size, 0);
    const usedGB = totalSize / (1024 * 1024 * 1024);
    setStorageUsed(Math.min((usedGB / 1) * 100, 100)); // 1GB limit
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const recentDocs = documents
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back{user?.email ? `, ${user.email}` : ''}!</h1>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button disabled={uploading} className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <h3 className="text-2xl font-bold">{documents.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shared Files</p>
              <h3 className="text-2xl font-bold">
                {documents.filter(doc => doc.shared).length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Storage Used</p>
            <Progress value={storageUsed} className="h-2" />
            <p className="text-sm text-muted-foreground">{storageUsed.toFixed(1)}% of 1GB used</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Recent Documents</h2>
        </div>
        <div className="space-y-4">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Modified {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {(doc.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}