import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import PhotoDetail from './PhotoDetail';
import { connect } from 'react-redux';
import { fetchPhotos } from '../redux/actions'

class PhotoList extends Component {

  componentWillMount() {
    this.props.fetchPhotos(this.props.route.params.albumId)
  }

  renderItem(item) {
    const photo = item.item
    return <PhotoDetail key={photo.title} title={photo.title} imageUrl={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} />
    
  }

  render() {
    if (this.props.isFetching) { 
			return (
        <View style={{ flex: 1 }}>
					<ActivityIndicator size="large" />
        </View>
				);
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList 
          data={this.props.photos}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    photos: state.photos.list,
    isFetching: state.photos.isFetching
  }
}

export default connect(mapStateToProps, { fetchPhotos })(PhotoList);
