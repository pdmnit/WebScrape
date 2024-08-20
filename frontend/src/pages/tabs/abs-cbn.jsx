// WORKING but the latest posts order are confusing

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
                const response = await axios.get('http://localhost:8080/api/abs/get');
                setArticles(response.data);
                // setArticles(response.data.reverse());
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
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        articles.map((article, index) => (
                            <div className="articles" key={index}>
                                <div className="content">
                                    <a href={article.articleUrl} className="title">
                                        <h2>{article.title}</h2>
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
