import {format} from 'date-fns';
import { Link } from 'react-router-dom';


export default function Post({_id, title, summary, content, cover, createdAt,author}){
    return(
        <div className="post">
        <div className="image">
            <Link to={`/post/${_id}`}>
            <img src={'http://localhost:4000/' + cover } alt=""></img>
            </Link>
        </div>
        <div className="title">
        <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
        </Link>    
            <p className="info">
                <a className="author">{author.UserName}</a>
                <time>{format(new Date(createdAt), 'dd MMM, yyyy HH:mm') }</time>
            </p>
        </div>
        <div className="post-content">
            <p>{summary}</p>
        </div>
    </div>
    
    );
}