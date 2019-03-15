import React, { PureComponent } from "react";
import { View, FlatList, Easing } from "react-native";
import { SharedElement } from "react-native-motion";
import ListItem from "./ListItem";
import data from "../../../utilities/Data";
import { styles } from "./style";

export default class ListView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { opacityOfSelectedItem: 1, selectedItem: null };
    this.sharedElementRefs = {};
  }

  onListItemPressed = item => {
    const { onItemPress } = this.props;
    this.setState({ selectedItem: item });
    onItemPress(item);
    this.sharedElementRefs[item.name].moveToDestination();
  };

  onMoveToDestinationWillStart = () => {
    this.setState({ opacityOfSelectedItem: 0 });
  };

  onMoveToSourceDidFinish = () => {
    this.setState({ opacityOfSelectedItem: 1 });
  };

  getSharedNode = props => {
    const { item } = props;

    return (
      <View style={{ backgroundColor: "transparent" }}>
        <ListItem item={item} animateOnDidMount={false} isHidden={false} />
      </View>
    );
  };

  renderItem = ({ item }) => {
    const { opacityOfSelectedItem } = this.state;
    const { selectedItem } = this.props;

    const isHidden = selectedItem && selectedItem.name !== item.name;
    const id = item.name;

    return (
      <SharedElement
        easing={Easing.in(Easing.back())}
        ref={node => (this.sharedElementRefs[id] = node)}
        id={id}
        onMoveToDestinationWillStart={this.onMoveToDestinationWillStart}
        onMoveToSourceDidFinish={this.onMoveToSourceDidFinish}
        getNode={this.getSharedNode}
        item={item}
      >
        <View
          style={{
            opacity: opacityOfSelectedItem,
            backgroundColor: "transparent"
          }}
        >
          <ListItem
            item={item}
            onPress={this.onListItemPressed}
            isHidden={isHidden}
          />
        </View>
      </SharedElement>
    );
  };

  render() {
    const { opacityOfSelectedItem } = this.state;
    const { phase } = this.props;

    return (
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          dataExtra={{ phase, opacityOfSelectedItem }}
          keyExtractor={item => item.name}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
