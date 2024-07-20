const express = require('express');
const router = express.Router();
const Guestbook = require('../models/Guestbook');

/**
 * @typedef {Object} GuestbookEntry
 * @property {string} name - 작성자의 이름
 * @property {string} message - 방명록에 남긴 메시지
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {string} message - 오류 메시지
 * @property {string} error - 상세 오류 정보
 */

/**
 * 새로운 방명록 글 작성 라우트
 * 
 * @route POST /api/guestbook
 * @group Guestbook - 방명록 관련 작업
 * @param {GuestbookEntry.model} entry.body.required - 추가할 방명록 글
 * @returns {GuestbookEntry.model} 200 - 생성된 방명록 글
 * @returns {ErrorResponse.model} 500 - 내부 서버 오류
 * @example request - 예제 입력
 * {
 *   "name": "홍길동",
 *   "message": "방명록 메시지입니다."
 * }
 * @example response - 200 - 예제 성공 응답
 * {
 *   "_id": "60c72b2f9b1d8c001c8e4d8e",
 *   "name": "Insidepixce",
 *   "message": "방명록 메시지입니다.",
 *   "__v": 0
 * }
 * @example response - 500 - 예제 오류 응답
 * {
 *   "message": "내부 서버 오류",
 *   "error": "오류 메시지 상세 내용"
 * }
 */
router.post('/', async (req, res) => {
    try {
        const entry = new Guestbook(req.body);
        await entry.save();
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: '내부 서버 오류', error: error.message });
    }
});

/**
 * 모든 방명록 글 조회 라우트
 * 
 * @route GET /api/guestbook
 * @group Guestbook - 방명록 관련 작업
 * @returns {Array.<GuestbookEntry>} 200 - 방명록 글 배열
 * @returns {ErrorResponse.model} 500 - 내부 서버 오류
 * @example response - 200 - 예제 성공 응답
 * [
 *   {
 *     "_id": "60c72b2f9b1d8c001c8e4d8e",
 *     "name": "홍길동",
 *     "message": "방명록 메시지입니다.",
 *     "__v": 0
 *   },
 *   {
 *     "_id": "60c72b3f9b1d8c001c8e4d8f",
 *     "name": "김영희",
 *     "message": "또 다른 방명록 메시지입니다.",
 *     "__v": 0
 *   }
 * ]
 * @example response - 500 - 예제 오류 응답
 * {
 *   "message": "내부 서버 오류",
 *   "error": "오류 메시지 상세 내용"
 * }
 */
router.get('/', async (req, res) => {
    try {
        const entries = await Guestbook.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: '내부 서버 오류', error: error.message });
    }
});

/**
 * 방명록 글 삭제 라우트
 * 
 * @route DELETE /api/guestbook/{id}
 * @group Guestbook - 방명록 관련 작업
 * @param {string} id.path.required - 삭제할 방명록 글의 ID
 * @returns {object} 200 - 확인 메시지
 * @returns {ErrorResponse.model} 500 - 내부 서버 오류
 * @example response - 200 - 예제 성공 응답
 * {
 *   "message": "삭제 완료"
 * }
 * @example response - 500 - 예제 오류 응답
 * {
 *   "message": "내부 서버 오류",
 *   "error": "오류 메시지 상세 내용"
 * }
 */
router.delete('/:id', async (req, res) => {
    try {
        await Guestbook.findByIdAndDelete(req.params.id);
        res.json({ message: '삭제 완료' });
    } catch (error) {
        res.status(500).json({ message: '내부 서버 오류', error: error.message });
    }
});

module.exports = router;
