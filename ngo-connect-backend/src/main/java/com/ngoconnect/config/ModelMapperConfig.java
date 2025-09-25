package com.ngoconnect.config;

import com.ngoconnect.dto.DonationDTO;
import com.ngoconnect.entity.Donation;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Configure Donation to DonationDTO mapping
        modelMapper.typeMap(Donation.class, DonationDTO.class).addMappings(mapper -> {
            mapper.map(Donation::getId, DonationDTO::setId);
            mapper.map(Donation::getAmount, DonationDTO::setAmount);
            mapper.map(Donation::getDonorMessage, DonationDTO::setDonorMessage);
            mapper.map(Donation::getDonationDate, DonationDTO::setDonationDate);
            
            // Map nested objects safely
            mapper.<Long>map(src -> src.getDonor() != null ? src.getDonor().getId() : null, 
                           (dest, v) -> dest.setUserId((Long) v));
                           
            mapper.<String>map(src -> src.getDonor() != null ? 
                                   (src.getDonor().getOrganizationName() != null && !src.getDonor().getOrganizationName().isEmpty() ? 
                                    src.getDonor().getOrganizationName() : 
                                    src.getDonor().getFullName()) : 
                                   null, 
                             (dest, v) -> dest.setDonorName((String) v));
                             
            mapper.<String>map(src -> src.getDonor() != null ? src.getDonor().getEmail() : null, 
                            (dest, v) -> dest.setDonorEmail((String) v));
            
            mapper.<Long>map(src -> src.getNgo() != null ? src.getNgo().getId() : null, 
                          (dest, v) -> dest.setNgoId((Long) v));
        });

        return modelMapper;
    }
}
