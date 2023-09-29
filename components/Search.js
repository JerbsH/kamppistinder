import React, { useState, useEffect } from 'react';
import { Layout, Input, FlatList, Text } from '@ui-kitten/components';

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
        media.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Layout>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
            </Layout>
          )}
        />
      ) : (
        <Text>No search results yet.</Text>
      )}
    </Layout>
  );
}
