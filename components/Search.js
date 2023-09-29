import React, { useState, useEffect } from 'react';
import { Layout, Input, Text, Button, Card, Image } from '@ui-kitten/components';
import { mediaUrl } from '../utils/app-config';

export function Search({ mediaArray }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchMedia = () => {
      if (!mediaArray) {
        setSearchResults([]);
        return;
      }

      const results = mediaArray.filter((media) =>
        media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        media.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (media.image && media.image.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      setSearchResults(results);
    };

    searchMedia();
  }, [searchQuery, mediaArray]);

  return (
    <Layout>
      <Input
        style={{ borderWidth: 1, padding: 8 }}
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      {searchQuery !== '' ? (
        searchResults.map((media) => (
          <Card key={media.id}>
            <Text>{media.title}</Text>
            <Text>{media.description}</Text>
            {media.image && <Image source={{ uri: mediaUrl }} style={{ width: 200, height: 200 }} />}
          </Card>
        ))
      ) : (
        <Text>No search results yet.</Text>
      )}
    </Layout>
  );
}
