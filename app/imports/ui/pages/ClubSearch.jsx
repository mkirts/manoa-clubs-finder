import React, { createRef } from 'react';
import {
  Grid,
  Icon,
  Header,
  Image,
  Sticky,
  Segment,
  Ref,
  Rail,
  Table,
  Checkbox,
  Card,
  Loader, Container
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/club/Clubs';
import { Notes } from '../../api/note/Notes';
import Club from '../components/Search';

/** A simple static component to render some text for the landing page. */
class ClubSearch extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>List Clubs</Header>
          <Card.Group>
            {this.props.clubs.map((club, index) => <Club
                key={index}
                club={club}
                notes={this.props.notes.filter(note => (note.clubId === club._id))}/>)}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubSearch.propTypes = {
  clubs: PropTypes.array.isRequired,
  notes: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Clubs.userPublicationName);
  const subscription2 = Meteor.subscribe(Notes.userPublicationName);
  return {
    clubs: Clubs.collection.find({}).fetch(),
    notes: Notes.collection.find({}).fetch(),
    ready: subscription.ready() && subscription2.ready(),
  };
})(ClubSearch);
