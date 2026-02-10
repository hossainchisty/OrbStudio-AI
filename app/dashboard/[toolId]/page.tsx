'use client';

import ChatInterface from '@/components/ChatInterface';
import { ToolType } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import FashionPhotographyPage from '../fashion-photography/page';
import ImageToPromptPage from '../image-to-prompt/page';
import ProductPhotographyPage from '../product-photography/page';
import VideoAdsPage from '../video-ads/page';

export default function ToolPage() {
    const params = useParams();
    const toolId = params.toolId as ToolType;

    return (
        <div className="h-full">
            <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
                <ToolContent />
            </Suspense>
        </div>
    );
}

function ToolContent() {
    const params = useParams();
    const toolId = params.toolId as ToolType;

    if (toolId === 'image-to-prompt') {
        return <ImageToPromptPage />;
    }

    if (toolId === 'fashion-photography') {
        return <FashionPhotographyPage />;
    }

    if (toolId === 'product-photography') {
        return <ProductPhotographyPage />;
    }

    if (toolId === 'video-ads') {
        return <VideoAdsPage />;
    }

    return <ChatInterface toolId={toolId} />;
}
