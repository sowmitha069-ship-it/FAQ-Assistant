const express = require("express");
const FAQ = require("../models/FAQ");

const router = express.Router();


// =====================================
// GET ALL FAQs
// =====================================

router.get("/", async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error fetching FAQs"
        });
    }
});


// =====================================
// ADD NEW FAQ
// =====================================

router.post("/", async (req, res) => {
    try {

        const faq = new FAQ({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer
        });

        const savedFAQ = await faq.save();

        res.status(201).json(savedFAQ);

    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: "Error adding FAQ"
        });
    }
});


// =====================================
// SEARCH FAQ
// =====================================

router.get("/search", async (req, res) => {

    try {

        const keyword = (req.query.keyword || "").trim();

        if (!keyword) {
            return res.json([]);
        }


        // ---------------------------------
        // 1. Exact question match
        // ---------------------------------

        const exactMatch = await FAQ.findOne({
            question: {
                $regex: `^${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i"
            }
        });


        if (exactMatch) {
            return res.json([exactMatch]);
        }


        // ---------------------------------
        // 2. Meaningful word matching
        // ---------------------------------

        const stopWords = [
            "how",
            "can",
            "i",
            "the",
            "a",
            "an",
            "is",
            "are",
            "what",
            "my",
            "to",
            "do",
            "does",
            "where",
            "when",
            "please"
        ];


        const words = keyword
            .toLowerCase()
            .replace(/[?.,!]/g, "")
            .split(/\s+/)
            .filter(word =>
                word.length > 2 &&
                !stopWords.includes(word)
            );


        // If no meaningful words
        if (words.length === 0) {
            return res.json([]);
        }


        // ---------------------------------
        // Search only questions
        // ---------------------------------

        const faqs = await FAQ.find();


        const results = faqs.filter(faq => {

            const question =
                faq.question.toLowerCase();


            let matchCount = 0;


            for (const word of words) {

                if (question.includes(word)) {
                    matchCount++;
                }

            }


            // If 2 or more meaningful words,
            // at least 2 must match.

            if (words.length >= 2) {
                return matchCount >= 2;
            }


            return matchCount >= 1;

        });


        res.json(results);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error searching FAQs"
        });

    }

});


module.exports = router;