import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import About from './AboutComponent';
import { postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders, postFeedback} from '../redux/ActionCreators';
import { Routes, Route, Navigate,useParams,useNavigate,useLocation} from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';



export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate();
    const location = useLocation();
    return (
      <Component history={history} 
      location={location} {...props}  />
    );

  };
  return Wrapper;
};


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }    
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  postFeedback: (firstname, lastname, telnum, email, agree, contactType, message) => dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message)),
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => {dispatch(fetchLeaders())}
});


  class Main extends Component {
  
  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    
  }

  
  
    render() {
      
      const HomePage = () => {
        return(
          <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishesErrMess={this.props.dishes.errMess}
                promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                promosLoading={this.props.promotions.isLoading}
                promosErrMess={this.props.promotions.errMess}
                leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                leadersLoading={this.props.leaders.isLoading}
                leadersErrMess={this.props.leaders.errMess}

          />
        );
      }

      const DishWithId = () => {
        const {dishId} = useParams();
        return (
          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(dishId,10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(dishId,10))}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
          />
        )

      }
      
    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
        <Routes location={this.props.location}>
          <Route path='/home' element= {<HomePage/>} />
          <Route exact path='/menu' element= {<Menu dishes={this.props.dishes}/> }/>
          <Route path="/menu/:dishId" element={<DishWithId/>} />
          <Route path="*" element={<Navigate replace to="/home" />} />
          <Route exact path="/contactus" element={<Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>}/>
          <Route exact path="/aboutus" element={<About leaders={this.props.leaders}/>} />
        </Routes>
        </CSSTransition>
        </TransitionGroup>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));
