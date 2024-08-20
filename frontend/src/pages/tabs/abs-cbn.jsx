import React, { useEffect, useState } from "react";
import axios from "axios";
import "../main.css";
import { ToastContainer } from "react-toastify";

const ABSCBN = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/abs', {
                    url: "https://news.abs-cbn.com/news"
                });
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="land">
            <ToastContainer />
            <p className="ret">LAST RETRIEVED: 2 MINS. AGO</p>
            <div className="big">
                <div className="articlecont">
                    {/* max of 10 articles per 1 page */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        articles.slice(0, 10).map((article, index) => (
                            <div className="articles" key={index}>
                                <div className="content">
                                    <a href={article.articleUrl} className="title">
                                        <h2>{article.title}</h2>
                                        <span className="news">ABS-CBN</span>
                                    </a>
                                    <p>{article.articleUrl}</p>
                                    <div className="contents">
                                        <p>Date: {article.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ABSCBN;
