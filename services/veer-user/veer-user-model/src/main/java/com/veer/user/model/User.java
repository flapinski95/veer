package com.veer.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private String id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Lob
    @Column(name = "bio")
    private String bio;

    @Column(name = "country", nullable = false)
    private String country;

    @ManyToMany(fetch = FetchType.LAZY) // don't fetch until needed
    @JoinTable(
        name = "followers",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "followed_id"))
    @Builder.Default
    private Set<User> following = new HashSet<>();

    /*
    * Tells Hibernate that this relationship is already defined and managed
    * by the 'following' field on the other side.
    * JPA will query the followers table's followed_id column to find all 
    * the follower_ids that point to the current user
    */
    @ManyToMany(
        mappedBy = "following", 
        fetch = FetchType.LAZY // don't fetch until needed
    )
    @Builder.Default
    private Set<User> followers = new HashSet<>();

    @Column(name = "profile_picture_url")
    private String profilePicture;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

}
