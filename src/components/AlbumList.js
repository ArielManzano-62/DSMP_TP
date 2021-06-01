import React, { useEffect } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import AlbumDetail from './AlbumDetail';
import { fetchAlbums } from '../redux/actions'

const AlbumList = (props) => {

  useEffect(() => {
    props.fetchAlbums()
  }, [])

  const renderItem = (album) => {
    return <AlbumDetail
        navigation={props.navigation}
        key={album.id}
        title={album.title._content}
        albumId={album.id}
      />
  }

  const loading = () => <ActivityIndicator size="large" />

  return (
    <View style={{ flex: 1 }}>
      {props.isFetching ? 
        loading()
        :<FlatList 
          data={props.albums}
          renderItem={(item) => renderItem(item.item)}
          keyExtractor={item => item.id}
          />
      }
    </View>
    
  );
}

const mapStateToProps = state => {
  return {
    albums: state.albums.list,
    isFetching : state.albums.isFetching
  }
}

export default connect(mapStateToProps, { fetchAlbums })(AlbumList);
