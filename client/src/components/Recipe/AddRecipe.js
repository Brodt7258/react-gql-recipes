import React from 'react';
import { withRouter } from 'react-router-dom';
import CKEditor from 'react-ckeditor-component';

import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../../queries';
import Error from '../Error';
import withAuth from '../withAuth';

const initialState = {
  name: '',
  imageUrl: '',
  instructions: '',
  category: 'Breakfast',
  description: '',
  username: ''
};

class AddRecipe extends React.Component {
  state = { ...initialState};

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ 
      [name]: value
    });
  }

  handleEditorChange = e => {
    const newContent = e.editor.getData();
    this.setState({ instructions: newContent });
  }

  clearState = () => {
    this.setState({ ...initialState });
  }

  handleSubmit = (e, addRecipe) => {
    e.preventDefault();
    addRecipe().then(({ data }) => {
      // console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  }

  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid = !name || !imageUrl || !category || !description || !instructions;
    return isInvalid;
  }

  updateCache = (cache, { data: { addRecipe }}) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    // console.log(getAllRecipes);
    // console.log(addRecipe);
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });
  }  

  render() {
    const { name, imageUrl, category, description, instructions, username } = this.state;
    return(
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, imageUrl, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form className="form" onSubmit={(e) => this.handleSubmit(e, addRecipe)}>
                <label htmlFor="name">Name of Recipe</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <label htmlFor="imageUrl">Recipe Image</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Recipe Image"
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <label htmlFor="category">Category of Recipe</label>
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <label htmlFor="description">Description of Recipe</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="instructions">Add Instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                />
                {/* <textarea
                  type="text"
                  name="instructions"
                  placeholder="Add Instructions"
                  onChange={this.handleChange}
                  value={instructions}
                /> */}
                <button disabled={loading || this.validateForm()} type="submit" className="button-primary">
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
}
};

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe));