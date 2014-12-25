var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Wlke", text: "This is another comment"}
];

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });  
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);  
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>{comment.text}</Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});


var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var authorNode = this.refs.author.getDOMNode();
    var textNode = this.refs.text.getDOMNode();
    var author = authorNode.value.trim();
    var text = textNode.getDOMNode().value.trim();
    if (!text || !author) return;

    this.props.onCommentSubmit({author: author, text: text});
    authorNode.value = '';
    textNode.value = '';
  },
  render: function() {
    return (
      <form className="commentForm">
        <input type="text" placeholder="Your Name" ref="author" />
        <input type="text" placeholder="Your Comment" ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        {this.props.children}
      </div>
    )
  }
})

var rootDiv = document.getElementById("content");

React.render(<CommentBox url="content.json" pollInterval={2000} />, rootDiv);

