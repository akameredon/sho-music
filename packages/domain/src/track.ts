/**
 * Track & Music Intelligence domain models
 */

export interface ArtistRef {
  id: string;
  name: string;
  role?: 'primary' | 'featured' | 'remixer' | 'producer';
}

export interface Classification {
  value: string;
  confidence: number;
}

export interface MusicIntelligence {
  genres: Classification[];
  moods: Classification[];
  energy: number;
  tempoBpm?: number;
  key?: string;
  language?: Classification[];
  vocalPresence: 'vocal' | 'instrumental' | 'mixed' | 'unknown';
  instruments: Classification[];
  era?: string;
  danceability?: number;
  acousticness?: number;
  explicit: boolean;
  embeddingId?: string;
  similarTrackIds?: string[];
  confidenceOverall: number;
  processedAt: Date;
  modelVersion: string;
}

export interface Track {
  id: string;
  isrc?: string;
  title: string;
  version?: string;
  artists: ArtistRef[];
  albumId?: string;
  albumArtist?: string;
  durationMs: number;
  releaseDate?: Date;
  explicit: boolean;
  language?: string;
  copyright?: string;
  publisher?: string;
  label?: string;
  intelligence?: MusicIntelligence;
  rightsState: string;
  rightsId?: string;
  originalObjectKey?: string;
  masterObjectKey?: string;
  streamObjectKey?: string;
  previewObjectKey?: string;
  artworkObjectKey?: string;
  fingerprint?: string;
  status: 'UPLOADED' | 'VALIDATING' | 'ANALYZING' | 'RIGHTS_REVIEW' | 'READY' | 'PUBLISHED' | 'RESTRICTED' | 'BLOCKED' | 'REMOVED';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Album {
  id: string;
  title: string;
  artists: ArtistRef[];
  releaseDate?: Date;
  trackIds: string[];
  artworkObjectKey?: string;
  type: 'ALBUM' | 'EP' | 'SINGLE' | 'COMPILATION';
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  trackIds: string[];
  isPublic: boolean;
  isAiGenerated: boolean;
  generatedFromPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}
