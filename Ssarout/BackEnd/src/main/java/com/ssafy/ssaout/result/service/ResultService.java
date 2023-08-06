package com.ssafy.ssaout.result.service;

import static com.ssafy.ssaout.common.error.ErrorCode.AMAZON_S3_ERROR;

import com.ssafy.ssaout.common.error.ErrorCode;
import com.ssafy.ssaout.common.error.exception.AWSException;
import com.ssafy.ssaout.common.error.exception.NotFoundException;
import com.ssafy.ssaout.common.utils.AmazonS3Uploader;
import com.ssafy.ssaout.result.domain.Result;
import com.ssafy.ssaout.result.dto.request.ResultCreateRequestDto;
import com.ssafy.ssaout.result.dto.response.ResultResponseDto;
import com.ssafy.ssaout.result.dto.response.ResultsResponseDto;
import com.ssafy.ssaout.result.repository.ResultRepository;
import com.ssafy.ssaout.song.domain.Song;
import com.ssafy.ssaout.song.repository.SongRepository;
import com.ssafy.ssaout.user.domain.entity.User;
import com.ssafy.ssaout.user.repository.UserRepository;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final AmazonS3Uploader amazonS3Uploader;

    public void createResult(ResultCreateRequestDto resultCreateRequestDto, String userId,
        MultipartFile multipartFile) {
        try {
            String recordFileUrl = amazonS3Uploader.upload(multipartFile);
            Song song = songRepository.findById(resultCreateRequestDto.getSongId())
                .orElseThrow(() -> new NotFoundException(
                    ErrorCode.SONG_NOT_FOUND));
            User user = userRepository.findByUserId(userId);
            Result result = resultRepository.save(Result.builder().song(song).user(user).accuracy(
                resultCreateRequestDto.getAccuracy()).recordFile(recordFileUrl).build());
        } catch (IOException e) {
            throw new AWSException(AMAZON_S3_ERROR);
        }
    }

    public ResultsResponseDto getResults(String userId) {
        User user = userRepository.findByUserId(userId);
        List<ResultResponseDto> resultList = resultRepository.findAllByUser(user)
            .stream().map(ResultResponseDto::new).collect(
                Collectors.toList());
        return new ResultsResponseDto(resultList, resultList.size());
    }
}
