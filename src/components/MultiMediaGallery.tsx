'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {ChevronLeft, ChevronRight, X, Play, Pause, Volume2, VolumeX, Maximize2} from 'lucide-react';

interface MediaItem {
    id?: string;
    type?: 'image' | 'video';
    url: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    alt?: string;
}

interface MultimediaGalleryProps {
    items: MediaItem[];
    className?: string;
    showThumbnails?: boolean;
    autoPlay?: boolean;
    showControls?: boolean;
}

// Main Gallery Component
const MultimediaGallery: React.FC<MultimediaGalleryProps> = ({
                                                                 items,
                                                                 className = '',
                                                                 showThumbnails = true,
                                                                 autoPlay = false,
                                                                 showControls = true,
                                                             }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

    // Navigation functions
    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Modal functions
    const openModal = (index: number) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsPlaying(false);
    };

    const goToNextModal = () => {
        setModalIndex((prev) => (prev + 1) % items.length);
    };

    const goToPreviousModal = () => {
        setModalIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    // Video controls
    const togglePlay = () => {
        if (videoRef) {
            if (isPlaying) {
                videoRef.pause();
            } else {
                videoRef.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef) {
            videoRef.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isModalOpen) {
                switch (event.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        goToPreviousModal();
                        break;
                    case 'ArrowRight':
                        goToNextModal();
                        break;
                    case ' ':
                        event.preventDefault();
                        if (items[modalIndex].type === 'video') {
                            togglePlay();
                        }
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, modalIndex, items, isPlaying]);

    // Auto-advance slides
    useEffect(() => {
        if (autoPlay && !isModalOpen) {
            const interval = setInterval(goToNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoPlay, isModalOpen, currentIndex]);

    return (
        <div className={`multimedia-gallery ${className}`}>
            <div className="max-w-xl">

                <div className="relative max-w-3xl h-96 md:h-[400px] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <div className="relative w-full h-full">
                        {items[currentIndex].type === 'image' ? (
                            <Image
                                src={items[currentIndex].url}
                                alt={items[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
                                fill
                                className="object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                                onClick={() => openModal(currentIndex)}
                                priority
                            />
                        ) : (
                            <video
                                className="w-full h-full object-cover cursor-pointer"
                                src={items[currentIndex].url}
                                onClick={() => openModal(currentIndex)}
                                muted
                                loop
                                playsInline
                            />
                        )}

                        {(items[currentIndex].title || items[currentIndex].description) && (
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                {items[currentIndex].title && (
                                    <h3 className="text-lg font-semibold mb-1">{items[currentIndex].title}</h3>
                                )}
                                {items[currentIndex].description && (
                                    <p className="text-sm opacity-90">{items[currentIndex].description}</p>
                                )}
                            </div>
                        )}

                        {items[currentIndex].type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => openModal(currentIndex)}
                                    className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200"
                                >
                                    <Play className="w-8 h-8 text-white ml-1"/>
                                </button>
                            </div>
                        )}
                    </div>

                    {showControls && items.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </button>
                        </>
                    )}

                    {showControls && items.length > 1 && (
                        <div className="absolute hidden md:block bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {showThumbnails && items.length > 1 && (
                    <div className="mt-4 flex space-x-3 overflow-x-auto pb-2">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                                    index === currentIndex
                                        ? 'ring-2 ring-blue-500 scale-105'
                                        : 'ring-1 ring-gray-300 hover:ring-blue-300'
                                }`}
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        src={item.thumbnail || item.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <Play className="w-4 h-4 text-white"/>
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <X className="w-6 h-6"/>
                        </button>

                        <div className="relative max-w-full max-h-full">
                            {items[modalIndex].type === 'image' ? (
                                <Image
                                    src={items[modalIndex].url}
                                    alt={items[modalIndex].alt || `Gallery image ${modalIndex + 1}`}
                                    width={1200}
                                    height={800}
                                    className="max-w-full max-h-[90vh] object-contain"
                                />
                            ) : (
                                <div className="relative">
                                    <video
                                        ref={setVideoRef}
                                        src={items[modalIndex].url}
                                        className="max-w-full max-h-[90vh] object-contain"
                                        controls={false}
                                        muted={isMuted}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onClick={togglePlay}
                                    />

                                    <div
                                        className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={togglePlay}
                                                className="text-white hover:text-blue-400 transition-colors"
                                            >
                                                {isPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
                                            </button>
                                            <button
                                                onClick={toggleMute}
                                                className="text-white hover:text-blue-400 transition-colors"
                                            >
                                                {isMuted ? <VolumeX className="w-6 h-6"/> :
                                                    <Volume2 className="w-6 h-6"/>}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => videoRef?.requestFullscreen()}
                                            className="text-white hover:text-blue-400 transition-colors"
                                        >
                                            <Maximize2 className="w-6 h-6"/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={goToPreviousModal}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
                                    aria-label="Previous item"
                                >
                                    <ChevronLeft className="w-8 h-8"/>
                                </button>
                                <button
                                    onClick={goToNextModal}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
                                    aria-label="Next item"
                                >
                                    <ChevronRight className="w-8 h-8"/>
                                </button>
                            </>
                        )}

                        <div
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
                            {modalIndex + 1} / {items.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultimediaGallery;